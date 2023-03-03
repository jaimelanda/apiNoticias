const { Schema, model } = require('mongoose');

const NoticiasSchema = Schema({
    title: { type: String, required: true },
    summary: { type: String },
    description: { type: String },
    image: { type: String },
    status:{type:Boolean},
    date: Date,
});

NoticiasSchema.method('toJSON', function() {
    //codigo para modificar el _id por default por uid pero solo para visualizacion en 
    //la base de datos seguira igual
    const { __v, ...object } = this.toObject();

    return object;

})

module.exports = model('News', NoticiasSchema,'News');