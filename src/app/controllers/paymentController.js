const OrderTable = require("../models/OrderTable");
const { mutipleMongooseToObject } = require("../../util/mongose");
const Course=require('../models/Course');
const {mongooseToObject}=require('../../util/mongose');

class paymentController {
  //GET/payment/buy
  buyCart(req, res, next) {
    var status = "View products added to cart here"
    var quantity;
    var cart = req.session.cart;
    if (req.session.cart) {
        quantity = cart.length;
    } else {
        quantity = 0;
    }
    if (req.session.cart) {
        var TotalS=0;
        var sum = 0;
        var cart = req.session.cart;
        for (var i = 0; i < cart.length; i++) {
            sum += cart[i].gia * cart[i].qty;
        }
        console.log(sum);
        console.log(cart[0].gia);
        var total = sum;
        TotalS=total+40;
        res.render('payment', {
            cart: req.session.cart,
            status,
            auth: req.session.isAuthenticated,
            total,
            quantity,
            TotalS,
        })
    } else {
        status = "Your cart is empty";
        res.render('payment', {
            status,
            auth: req.session.isAuthenticated,
            quantity
        })
    }
}

  //post/add
  buyAdd(req,res,next){
    //res.json(req.body)
    const OrderTables=new OrderTable(req.body);
    OrderTables.save()
        .then(()=>res.redirect('/payment/orderCart'))
        .catch(error =>{
            
        });
  }

  //GET/payment/orderCart
  /*orderCart(req,res,next){
    OrderTable.find({})
        .then(ordertables=>{
            res.render('MyOrder',{
                ordertables:mutipleMongooseToObject(ordertables)
            });
        })
        .catch(next);
    }*/
    orderCart(req,res,next){
        Promise.all([OrderTable.find({}), OrderTable.countDocumentsDeleted()])
            .then(([ordertables, deletedCount]) =>
                res.render('MyOrder', {
                    deletedCount,
                    ordertables: mutipleMongooseToObject(ordertables),
                }),
            )
            .catch(next);

    }

    //get/payment/buynows
    buynows(req,res,next){
        var pricenow=0;
        Course.findById(req.params.id)
            .then(course=>res.render('buys/payment-now',{
                course:mongooseToObject(course),
                pricenow:parseInt(course.gia)+40,
            }))
            .catch(next);
    }

    //post/payment/buynow
    buynow(req,res,next){
        //res.json(req.body)
        const OrderTables=new OrderTable(req.body);
        OrderTables.save()
            .then(()=>res.redirect('/payment/orderCart'))
            .catch(error =>{
                
            });
      }

    //get/payment/:id/edit
    edit(req,res,next){
        OrderTable.findById(req.params.id)
            .then(ordertables=>res.render('buys/edit',{
                ordertables:mongooseToObject(ordertables)
            }))
            .catch(next);
    }

    //put/payment/:id
    update(req,res,next){
        OrderTable.updateOne({_id:req.params.id},req.body)
            .then(()=>res.redirect('/payment/orderCart'))
            .catch(next);
    }

      //delete/payment/cancel-order/:id
    cancel_order(req,res,next){
        OrderTable.delete({ _id:req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);
    }

    // [DELETE]/payment/cancel/:id/force
    force_order(req, res, next) {
        OrderTable.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

   // [PATCH] /payment/:id/restore
   restore(req, res, next) {
        OrderTable.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [GET] /payment/trashbuy
    trashbuy(req, res, next) {
        OrderTable.findDeleted({})
            .then((ordertables) =>
                res.render('buys/cancel-order', {
                    ordertables: mutipleMongooseToObject(ordertables),
                }),
            )
            .catch(next);
    }

}

module.exports = new paymentController();
