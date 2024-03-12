const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import fs
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let products;
let productSale;
let productRecommed;
let favorites;
let cart;

app.use(express.json());

// POST USER 
app.post('/api/register', (req, res) => {
    try {
        const userData = fs.readFileSync('user.json');
        const users = JSON.parse(userData);

        const { email, password } = req.body;

        const userExists = users.some((user) => user.email === email);
        if (userExists) {
            return res.status(400).json({ error: 'Email đã được đăng ký trước đó.' });
        }

        users.push({ email, password });
        fs.writeFileSync('user.json', JSON.stringify(users, null, 2));

        res.json({ message: 'Đăng ký thành công.' });
    } catch (error) {
        console.error('Error saving registration data:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng ký.' });
    }
});

// GET USER
app.get('/api/register', (req, res) => {
    try {
        const userData = fs.readFileSync('user.json');
        const users = JSON.parse(userData);
        res.json(users);
    } catch (error) {
        console.error('Error reading user data:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu người dùng.' });
    }
});

// GET PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const productsData = await fsPromises.readFile('products.json', 'utf-8');
        products = JSON.parse(productsData);
        res.json(products);
    } catch (error) {
        console.error('Error reading products data:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu sản phẩm.' });
    }
});

// GET ID PRODUCTS
app.get('/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    if (!products) {
        // Đọc dữ liệu sản phẩm từ tệp products.json
        try {
            const productsData = await fs.promises.readFile('products.json', 'utf-8');
            products = JSON.parse(productsData);
        } catch (error) {
            console.error('Error reading products data:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu sản phẩm.' });
            return; // Thoát khỏi handler để tránh tiếp tục thực hiện logic và gây lỗi khác
        }
    }
    const product = products.quan.concat(products.ao, products.giay, products.mu)
        .find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
});

// GET SALE PRODUCTS
app.get('/api/saleproducts', async (req, res) => {
    try {
        const saleProductsData = await fsPromises.readFile('SaleProducts.json', 'utf-8');
        productSale = JSON.parse(saleProductsData);
        res.json(productSale);
    } catch (error) {
        console.error('Error reading sale products data:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu sản phẩm khuyến mãi.' });
    }
});

// GET ID PRODUCTS SALE
app.get('/saleproducts/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productSale.as.concat(productSale.ao, productSale.giay, productSale.mu)
        .find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
});

// GET ID PRODUCTS RECOMMEND
app.get('/recommedproducts/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    if (!productRecommed) {
        // Đọc dữ liệu sản phẩm đề xuất từ tệp RecommedProducts.json
        try {
            const recommendProductData = fs.readFileSync('RecommedProducts.json');
            productRecommed = JSON.parse(recommendProductData);
        } catch (error) {
            console.error('Error reading recommended products data:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu sản phẩm đề xuất.' });
            return; // Thoát khỏi handler để tránh tiếp tục thực hiện logic và gây lỗi khác
        }
    }
    const product = productRecommed.ao.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
});

// GET RECOMMENDED PRODUCTS
app.get('/api/recommedproducts', (req, res) => {
    if (!productRecommed) {
        // Đọc dữ liệu sản phẩm đề xuất từ tệp RecommedProducts.json
        try {
            const recommendProductData = fs.readFileSync('RecommedProducts.json');
            productRecommed = JSON.parse(recommendProductData);
        } catch (error) {
            console.error('Error reading recommended products data:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu sản phẩm đề xuất.' });
            return; // Thoát khỏi handler để tránh tiếp tục thực hiện logic và gây lỗi khác
        }
    }
    res.json(productRecommed);
});

// GET FAVORITES
app.get('/api/favorites', async (req, res) => {
    try {
        const favoritesData = await fsPromises.readFile('favorites.json');
        favorites = JSON.parse(favoritesData);
        res.json(favorites);
    } catch (error) {
        console.error('Error reading favorites data:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu danh sách yêu thích.' });
    }
});

// POST FAVORITES
app.post('/api/favorites', (req, res) => {
    try {
        const { product } = req.body;
        const favoritesData = fs.readFileSync(path.join(__dirname, 'favorites.json'));

        let favoritesProducts;

        try {
            favoritesProducts = JSON.parse(favoritesData);
            if (!Array.isArray(favoritesProducts)) {
                throw new Error('Invalid data format in favorites.json');
            }
        } catch (error) {
            // Nếu có lỗi khi parse JSON hoặc không phải là mảng, tạo mảng mới
            favoritesProducts = [];
        }

        if (favoritesProducts.some((item) => item.id === product.id)) {
            return res.status(400).json({ error: 'Sản phẩm đã tồn tại trong danh sách yêu thích.' });
        }

        favoritesProducts.push(product);
        fs.writeFileSync(path.join(__dirname, 'favorites.json'), JSON.stringify(favoritesProducts, null, 2));
        res.json({ message: 'Sản phẩm đã được thêm vào danh sách yêu thích.' });
    } catch (error) {
        console.error('Error saving favorite product:', error);
        res.status(400).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm vào danh sách yêu thích.' });
    }
});

// DELETE FAVORITES PRODUCTS
app.delete('/api/favorites/:id', (req, res) => {
    const itemId = req.params.id;

    try {
        const favoritesData = fs.readFileSync('favorites.json');
        let favorites = JSON.parse(favoritesData);

        // Tìm và xóa sản phẩm có ID là itemId từ danh sách yêu thích
        const indexToRemove = favorites.findIndex(item => item.id === parseInt(itemId));
        if (indexToRemove !== -1) {
            favorites.splice(indexToRemove, 1);

            // Lưu lại danh sách yêu thích sau khi xóa
            fs.writeFileSync('favorites.json', JSON.stringify(favorites, null, 2));

            // Trả về phản hồi
            res.status(200).json({ message: `Đã xóa thành công phần tử có ID ${itemId}` });
        } else {
            // Trả về lỗi nếu không tìm thấy sản phẩm
            res.status(404).json({ error: `Không tìm thấy sản phẩm có ID ${itemId}` });
        }
    } catch (error) {
        console.error('Error deleting favorite product:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi danh sách yêu thích.' });
    }
});

// Hàm GET để lấy thông tin giỏ hàng
app.get('/api/cart', async (req, res) => {
    try {
      const cartFile = await fsPromises.readFile('cart.json', 'utf-8');
  
      if (!cartFile.trim()) {
        // Nếu tệp trống, trả về mảng rỗng
        return res.json([]);
      }
  
      let cartData;
  
      try {
        cartData = JSON.parse(cartFile);
      } catch (parseError) {
        console.error('Error parsing cart.json:', parseError);
        return res.status(500).json({ error: 'Lỗi định dạng JSON khi đọc dữ liệu giỏ hàng.' });
      }
  
      res.json(cartData);
    } catch (error) {
      console.error('Error reading cart data:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi đọc dữ liệu giỏ hàng.' });
    }
  });
  
  // Hàm POST để thêm sản phẩm vào giỏ hàng
  app.post('/api/cart', async (req, res) => {
    try {
        const { name, price, image, size, color } = req.body;

        if ( !name || !price || !image || !size || !color) {
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
        }

        let cartData = [];

        try {
            const cartFile = await fsPromises.readFile('cart.json', 'utf-8');

            // Thêm kiểm tra xem chuỗi JSON có trống không
            cartData = cartFile.trim() ? JSON.parse(cartFile) : [];
        } catch (readError) {
            console.error('Error reading cart.json:', readError);
            // Xử lý lỗi đọc tệp
        }

        // Tạo một mục mới cho mỗi size và color khác nhau
        const newSizeColors = Array.isArray(size) ? size : [size];
        const newColors = Array.isArray(color) ? color : [color];

        newSizeColors.forEach(newSize => {
            newColors.forEach(newColor => {
                const existingProductIndex = cartData.findIndex(item => {
                    const existingSize = item.size?.size || 'Unknown Size';
                    const existingColor = item.color?.na || 'Unknown Color';

                    return existingSize === newSize && existingColor === newColor;
                });

                if (existingProductIndex !== -1) {
                    // Sản phẩm đã tồn tại trong giỏ hàng, tăng quantity lên
                    cartData[existingProductIndex].quantity += 1;
                } else {
                    // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
                    const itemId = uuidv4();
                    const newCartItem = {
                        id:itemId,
                        name,
                        price,
                        image,
                        size: { size: newSize },
                        color: { na: newColor },
                        quantity: 1,
                    };
                    cartData.push(newCartItem);
                }
            });
        });

        await fsPromises.writeFile('cart.json', JSON.stringify(cartData, null, 2));

        res.status(200).json({ success: true, message: 'Sản phẩm đã được thêm vào giỏ hàng' });
    } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu POST:', error.message);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý yêu cầu' });
    }
});



  // DELETE CART 
  app.delete('/api/cart/:id', (req, res) => {
    const itemId = req.params.id;
  
    try {
      const cartData = fs.readFileSync('cart.json');
      let cart = JSON.parse(cartData);
  
      // Tìm và xóa sản phẩm có ID là itemId từ giỏ hàng
      const updatedCart = cart.filter(item => item.id !== itemId);
  
      if (cart.length !== updatedCart.length) {
        // Lưu lại giỏ hàng sau khi xóa
        fs.writeFileSync('cart.json', JSON.stringify(updatedCart, null, 2));
  
        // Trả về phản hồi
        res.status(200).json({ message: `Đã xóa thành công phần tử có ID ${itemId}` });
      } else {
        // Trả về lỗi nếu không tìm thấy sản phẩm
        res.status(404).json({ error: `Không tìm thấy sản phẩm có ID ${itemId}` });
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running at http://192.168.0.105:${port}`);
});
