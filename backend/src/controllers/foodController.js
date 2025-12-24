
const Foods = require('../models/foods');
const { saveLocalImage, deleteImage } = require("../utils/saveImage");
exports.createFood = async (req, res) => {
    console.log("geldi")
    try {
        const { name, price, description, categoryId } = req.body;
        const files = req.files; // multer files
        console.log(categoryId)
        if (!files || !Array.isArray(files) || files.length < 1 || files.length > 2) {
            return res.status(400).json({ success: false, message: "1 veya 2 resim seçilmelidir" });
        }
        newImgs = files.map(file => saveLocalImage(file));
        const food = await Foods.create({
            name,
            price,
            description,
            categoryId,
            imgs: newImgs,
            isDeleted:false
        });

        res.json({ success: true, data: food });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateFood = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, description, categoryId } = req.body;
        const files = req.files; // multer files

        const food = await Foods.findById(id);
        if (!food) return res.status(404).json({ success: false, message: "Food not found" });

        let newImgs = food.imgs; // default olarak eski resimler

        // Yeni resim geldiyse işleme al
        if (files && files.length > 0) {
            // Eski resimleri sil
            for (const img of food.imgs) {
                try {
                    deleteImage(img) //  
                } catch (e) { }
            }

            // Yeni resimleri kaydet
            newImgs = files.map(file => saveLocalImage(file));
        }

        const updated = await Foods.findByIdAndUpdate(
            id,
            {
                name,
                price,
                description,
                categoryId,
                imgs: newImgs
            },
            { new: true }
        );
        res.json({ success: true, data: updated });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteFood = async (req, res) => {
    try {
        const id = req.params.id;

        const current = await Foods.findById(id);

        if (!current)
            return res.status(404).json({ success: false, message: "Food not found" });

        // Resimleri sil
       // current.imgs.forEach((img) => deleteImage(img));

        // Veriyi sil
        await Foods.findByIdAndUpdate(id,{
            isDeleted:true
        });

        res.json({ success: true, message: "Food deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getFoods = async (req, res) => {
    try {
        const foods = await Foods.find({isDeleted:false});
        res.json({ success: true, data: foods });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
