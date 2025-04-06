// Configuration pour le scraping des produits
module.exports = {
    // URLs des produits à scraper
    productUrls: [
        'https://www.fraginspiration.com/parfum-chogan/parfum-chogan-001/',
        'https://www.fraginspiration.com/parfum-chogan-homme/parfum-chogan-038/',
        'https://www.fraginspiration.com/parfum-chogan-mixte/parfum-chogan-118/',
        'https://www.fraginspiration.com/parfum-chogan-homme/parfum-chogan-094/',
        'https://www.fraginspiration.com/parfum-chogan-homme/parfum-chogan-016/',
        'https://www.fraginspiration.com/parfum-chogan-mixte/parfum-chogan-127/',
        'https://www.fraginspiration.com/parfum-chogan-homme/parfum-chogan-068/',
        'https://www.fraginspiration.com/parfum-chogan-homme/parfum-chogan-032/',
        'https://www.fraginspiration.com/parfum-chogan-mixte/parfum-chogan-099/',
        'https://www.fraginspiration.com/parfum-chogan-mixte/parfum-chogan-135/'
    ],

    // Sélecteurs pour les éléments à extraire
    selectors: {
        title: '.product_title',  // Titre du produit
        description: '.woocommerce-product-details__short-description',  // Description du produit
        image: '.wp-post-image'  // Image principale du produit
    },

    // Dossier de sortie pour les données et images
    output: {
        dataPath: '../data/products.json',
        imagesPath: '../data/images'
    }
};
