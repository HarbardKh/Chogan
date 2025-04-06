const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

class ProductScraper {
    constructor() {
        this.config = config;
        this.products = [];
    }

    async downloadImage(imageUrl, productId) {
        try {
            const response = await axios({
                url: imageUrl,
                responseType: 'arraybuffer'
            });

            const imagePath = path.join(__dirname, this.config.output.imagesPath, `${productId}.jpg`);
            await fs.mkdir(path.dirname(imagePath), { recursive: true });
            await fs.writeFile(imagePath, response.data);
            
            return path.relative(__dirname, imagePath);
        } catch (error) {
            console.error(`Erreur lors du téléchargement de l'image: ${error.message}`);
            return null;
        }
    }

    async scrapeProduct(url) {
        try {
            console.log(`Récupération de la page ${url}...`);
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            console.log('Status:', response.status);
            console.log('Content-Type:', response.headers['content-type']);
            const $ = cheerio.load(response.data);
            
            // Extraire les données de base
            console.log('Extraction du titre...');
            const titleEl = $(this.config.selectors.title);
            const title = titleEl.length ? titleEl.text().trim() : null;
            if (!title) console.log('Titre non trouvé');
            
            console.log('Extraction de la description...');
            const descEl = $(this.config.selectors.description);
            const description = descEl.length ? descEl.text().trim() : null;
            if (!description) console.log('Description non trouvée');
            
            console.log('Extraction de l\'image...');
            const imgEl = $(this.config.selectors.image);
            const imageUrl = imgEl.length ? imgEl.attr('src') : null;
            if (!imageUrl) console.log('Image non trouvée');

            // Extraire l'ID du produit depuis l'URL
            const productId = url.match(/chogan-([0-9]+)/)[1];

            // Télécharger l'image
            const imagePath = await this.downloadImage(imageUrl, productId);

            return {
                id: productId,
                title,
                description,
                imagePath,
                sourceUrl: url
            };
        } catch (error) {
            console.error(`Erreur lors du scraping de ${url}:`, error.message);
            return null;
        }
    }

    async scrapeAllProducts() {
        console.log('Début du scraping...');
        
        for (const url of this.config.productUrls) {
            console.log(`Scraping de ${url}...`);
            const product = await this.scrapeProduct(url);
            if (product) {
                this.products.push(product);
                console.log(`Produit ${product.id} scrapé avec succès`);
            }
            // Attente polie entre chaque requête
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`Scraping terminé. ${this.products.length} produits extraits.`);
    }

    async saveToFile() {
        const outputPath = path.resolve(__dirname, this.config.output.dataPath);
        
        try {
            // Créer le dossier de sortie s'il n'existe pas
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            
            // Sauvegarder les données
            await fs.writeFile(
                outputPath,
                JSON.stringify(this.products, null, 2),
                'utf8'
            );
            
            console.log(`Données sauvegardées dans ${outputPath}`);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error.message);
        }
    }

    async run() {
        await this.scrapeAllProducts();
        await this.saveToFile();
    }
}

// Exécution
if (require.main === module) {
    const scraper = new ProductScraper();
    scraper.run().catch(console.error);
}
