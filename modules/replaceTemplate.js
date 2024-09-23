module.exports = (template,product)=>{
    let output = template.replace(/{%PRODUCTNAME%}/g,product.productName)
    output = output.replace(/{%PRODUCTIMAGE%}/g,product.image)
    output = output.replace(/{%PRICE%}/g,product.price)
    output = output.replace(/{%FROM%}/g,product.from)
    output = output.replace(/{%NUTRIENT%}/g,product.nutrient)
    output = output.replace(/{%QUANTITY%}/g,product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g,product.description)
    output = output.replace(/{%ID%}/g,product.id)

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,"not-organic")

        return output;
 }