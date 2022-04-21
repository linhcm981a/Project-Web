const Dg =require('../models/dg');
const {mongooseToObject, mutipleMongooseToObject}=require('../../util/mongose');
const Course =require('../models/Course');

class dg{
    
    //GET/dg/:id/create
    create(req,res,next){
         res.render('danhgia/dg')
   }

    
    //post/dg/in
    in(req,res,next){ 
        const dg=new Dg(req.body);
        dg.save()
            .then(()=>res.redirect('/'))    

         
    }

        //get/dg/see
        see(req,res,next){
            Dg.find({})
            .then((dgs) =>
                res.render('danhgia/show', {
                    dgs: mutipleMongooseToObject(dgs),
                }),
            )
            .catch(next);

    }
        

}

module.exports=new dg;