var express = require('express');
let session = require('express-session');
const nodemailer = require("nodemailer");
var router = express.Router();
let USER = require('../model/user');
let category = require('../model/Category');
let subcategory = require('../model/Subcategory');

router.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);



/* GET home page (web page). */
router.get('/', async (req, res, next) => {
  let categoryData = await category.find();
  res.render('Web', {
    title: 'Welcome to the Website',
    loggedIn: req.session.loggedIn,
    category: categoryData,
  });
});



/* GET signup page. */
router.get('/signup', (req, res, next) => {
  res.render('signup', {
    title: 'Signup',
    error: null,
    loggedIn: req.session.loggedIn,
  });
});



/* POST signup handler. */
router.post('/signup', async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.render('signup', {
      error: 'Email and Password are required!',
      loggedIn: req.session.loggedIn,
    });
  }



  // Check if email already exists
  let userExists = await USER.findOne({ email });
  if (userExists) {
    return res.render('signup', {
      error: 'Email ID already exists!',
      loggedIn: req.session.loggedIn,
    });
  }



  // Create new user
  await USER.create({ email, password });
  res.redirect('/login');
});



/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('login', { error: null });
});



/* POST login handler. */
router.post('/login', async (req, res, next) => {
  try {
    const { checkemail, checkpassword } = req.body;

    let user = await USER.findOne({ email: checkemail });

    if (!user) {
      throw new Error('Email is incorrect');
    }

    if (user.password !== checkpassword) {
      throw new Error('Password is incorrect');
    }

    req.session.loggedIn = true;
    req.session.user = { email: user.email };

    main(checkemail)

    return res.redirect('/');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});



/* GET logout handler. */
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});



/* Add Category */
router.post('/categories/add', async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }

  try {
    const { type, newcategory, imageurl, summary } = req.body;
    await category.create({
      type,
      newcategory,
      imageurl,
      summary,
    });
    res.redirect('/');
  } catch (error) {
    console.log('Error adding category:', error);
    res.status(500).send('Error adding category');
  }
});


/* Delete Category */
router.post('/categories/delete', async (req, res) => {
  console.log("Hello babubhai");
  
  try {
    // Retrieve the category ID from the query parameters
    const { id } = req.body;

    if (!id) {
      return res.status(400).send('Category ID is required');
    }

    // Remove the category
    await category.findByIdAndDelete(id);

    res.redirect('/');
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send('Error deleting category');
  }
});



/* Get Category and Subcategories */
router.get('/subcategories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categories = await category.findById(categoryId);
    const subcategories = await subcategory.find({ categoryId: categoryId });

    res.render('subcategoryweb', {
      category: categories,
      subcategories: subcategories,
      loggedIn: req.session.loggedIn,
    });
  } catch (error) {
    console.error('Error fetching category and subcategories:', error);
    res.status(500).send('Error fetching category details');
  }
});



/* Update Category */
router.post('/categories/update', async (req, res) => {
  const { id, type, newcategory, imageurl, summary } = req.body;
  await category.findByIdAndUpdate(id, {
    type,
    newcategory,
    imageurl,
    summary,
  });
  res.redirect('/');
});



/* Add Subcategory */
router.post('/subcategories/add', async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }

  try {
    const { name, subcategoryName, imageurl, details, moreInfo, categoryId } = req.body;
    await subcategory.create({
      name,
      subcategoryName,
      imageurl,
      details,
      moreInfo,
      categoryId,
    });
    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    console.log('Error adding subcategory:', error);
    res.status(500).send('Error adding subcategory'); 
  }
});


router.post('/subcategories/delete', async (req, res) => {
  console.log("Hello babubhai Batliwala");
  
  try {
    // Retrieve the category ID from the query parameters
    const { id } = req.body;

    if (!id) {
      return res.status(400).send('Category ID is required');
    }

    // Remove the category
    let data = await subcategory.findByIdAndDelete(id);
    
    res.redirect(`/categories/${data.categoryId}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send('Error deleting category');
  }
});


/* Update Subcategory */
router.post('/subcategories/update', async (req, res) => {
  try {
    const { subcategoryId, name, subcategoryName, imageurl, details, moreInfo, categoryId } = req.body;

    await subcategory.findByIdAndUpdate(
      subcategoryId,
      {
        name,
        subcategoryName,
        imageurl,
        details,
        moreInfo,
      },
      { new: true }
    );

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).send('Error updating subcategory');
  }
});





// router.get('/categories/delete/:id', (req,res) => {
//   try {
//     console.log("Success");
    
//   } catch (error) {
//     console.log("fail");
    
//   }


// })







const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "moonenterprise8989@gmail.com",
    pass: "tedgcfqwhpqxnrxt",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(mail) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Welcome to World Top 10 News 👻" <moonenterprise8989@gmail.com>', // sender address
    to: mail, // list of receivers
    subject: "Hello ✔, This Project Testing", // Subject line
    text: "Hello! Welcome to Top 10 Viral News", // plain text body
    html: "<b>Thank you For Login In our Website</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

// check edit push code in github


module.exports = router;
