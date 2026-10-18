package com.delivery.rastreador.config;

import com.delivery.rastreador.model.Product;
import com.delivery.rastreador.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            logger.info("Iniciando carga inicial de 50 produtos com 10 unidades de estoque cada...");
            List<Product> initialProducts = List.of(
                // Hambúrgueres (12)
                new Product("Hambúrguer Clássico Artesanal", "Pão brioche tostado na manteiga, burger artesanal 160g, queijo cheddar fatiado e maionese especial", 28.90, 10, "Hambúrgueres"),
                new Product("X-Bacon Supremo", "Burger artesanal 180g, tiras crocantes de bacon defumado, queijo cheddar duplo e barbecue caseiro", 34.90, 10, "Hambúrgueres"),
                new Product("X-Salada Especial", "Burger 160g grelhado, queijo prato derretido, alface americana fresca, rodelas de tomate e maionese verde", 26.50, 10, "Hambúrgueres"),
                new Product("Smash Burger Duplo", "Dois burgers smash prensados de 90g cada, queijo cheddar fatiado, cebola caramelizada e picles", 32.00, 10, "Hambúrgueres"),
                new Product("Smash Burger Triplo Cheddar", "Três carnes smash de 90g, tripla camada de cheddar cremoso e farofa crocante de bacon", 39.90, 10, "Hambúrgueres"),
                new Product("X-Tudo Monstro da Casa", "Burger 180g, queijo, presunto, ovo na chapa, bacon, milho, alface, tomate e batata palha fininha", 38.50, 10, "Hambúrgueres"),
                new Product("Chicken Crispy Burger", "Sobrecoxa de frango super empanada e crocante, salada coleslaw americana e molho honey mustard", 29.90, 10, "Hambúrgueres"),
                new Product("Cheddar Melt Bacon", "Burger bovino 180g coberto por cascata de queijo cheddar cremoso e cebola grelhada no shoyu", 36.00, 10, "Hambúrgueres"),
                new Product("Veggie Burger de Grão-de-Bico", "Hambúrguer artesanal de grão-de-bico com especiarias, rúcula fresca, tomate seco e maionese vegana", 31.50, 10, "Hambúrgueres"),
                new Product("Costela BBQ Burger", "Hambúrguer de costela bovina desfiada lentamente no forno, queijo provolone e molho barbecue rústico", 42.00, 10, "Hambúrgueres"),
                new Product("Gorgonzola Burger Gourmet", "Burger 180g na brasa, creme aveludado de gorgonzola, cebola roxa marinada e folhas de rúcula", 37.90, 10, "Hambúrgueres"),
                new Product("Mushroom Swiss Burger", "Burger 180g, mix de cogumelos paris e shimeji salteados na manteiga, queijo suíço derretido e maionese trufada", 44.00, 10, "Hambúrgueres"),

                // Pizzas & Massas (10)
                new Product("Pizza Calabresa Especial", "Massa artesanal de fermentação lenta, molho pelati italiano, mussarela, calabresa fatiada fina e cebola", 49.90, 10, "Pizzas"),
                new Product("Pizza Margherita Clássica", "Molho de tomate fresco, mussarela de búfala, rodelas de tomate italiano e folhas de manjericão fresco", 52.00, 10, "Pizzas"),
                new Product("Pizza Quatro Queijos", "Combinação nobre de mussarela, provolone curado, parmesão ralado e requeijão cremoso tipo catupiry", 56.90, 10, "Pizzas"),
                new Product("Pizza Frango com Catupiry", "Peito de frango desfiado temperado com ervas finas, milho verde selecionado e cobertura de Catupiry original", 54.00, 10, "Pizzas"),
                new Product("Pizza Pepperoni Supreme", "Massa média crocante, molho artesanal, camada generosa de mussarela e fatias selecionadas de pepperoni", 58.50, 10, "Pizzas"),
                new Product("Pizza Portuguesa Tradicional", "Mussarela, presunto cozido picado, ovos cozidos, cebola fatiada, ervilhas frescas e azeitonas pretas", 53.00, 10, "Pizzas"),
                new Product("Pizza Vegetariana Especial", "Abobrinha italiana grelhada, berinjela confitada, tomate cereja confit, palmito e queijo brie", 57.00, 10, "Pizzas"),
                new Product("Pizza Carne Seca com Coalho", "Carne seca desfiada refogada na manteiga de garrafa, queijo de coalho tostado e cebola caramelizada", 62.00, 10, "Pizzas"),
                new Product("Lasanha Bolonhesa Tradicional", "Massa artesanal fresca intercalada com molho bolonhesa rico em carne bovina e gratinada com parmesão", 38.00, 10, "Pizzas"),
                new Product("Nhoque ao Molho Quatro Queijos", "Nhoque de batata macio feito à mão regado com molho cremoso de quatro queijos especiais", 36.90, 10, "Pizzas"),

                // Acompanhamentos & Petiscos (10)
                new Product("Batata Frita Tradicional Palito", "Batatas palito douradas e crocantes, temperadas com sal marinho e leve toque de páprica doce", 16.90, 10, "Acompanhamentos"),
                new Product("Batata Rústica com Alecrim e Alho", "Gomos de batatas artesanais com casca assados ao ponto, alecrim fresco e maionese caseira de alho", 22.00, 10, "Acompanhamentos"),
                new Product("Batata Frita com Cheddar e Bacon", "Porção generosa de batatas crocantes cobertas com banho de queijo cheddar e cubinhos de bacon tostado", 28.50, 10, "Acompanhamentos"),
                new Product("Onion Rings Crocantes (10 un)", "Anéis de cebola fresca empanados em massa crocante temperada, acompanha molho barbecue", 21.00, 10, "Acompanhamentos"),
                new Product("Coxinhas de Frango Cremosas (8 un)", "Mini coxinhas de frango com massa fina e recheio cremoso temperado, ultra crocantes", 24.00, 10, "Acompanhamentos"),
                new Product("Bolinhos de Queijo Gouda (8 un)", "Bolinhos fritos dourados recheados com generoso queijo gouda derretido ao morder", 26.00, 10, "Acompanhamentos"),
                new Product("Iscas de Frango Empanadas", "Tiras macias de peito de frango empanadas com crosta dourada e crocante, acompanha molho tártaro", 27.90, 10, "Acompanhamentos"),
                new Product("Dadinhos de Tapioca com Coalho (8 un)", "Cubos crocantes de tapioca e queijo de coalho dourados na hora, servidos com geleia de pimenta defumada", 25.00, 10, "Acompanhamentos"),
                new Product("Pastéis Mini Sortidos (6 un)", "Pastéis sequinhos nos sabores carne temperada, queijo derretido e palmito com ervas", 23.50, 10, "Acompanhamentos"),
                new Product("Pão de Alho Especial com Requeijão (2 un)", "Baguetes crocantes recheadas com pasta cremosa de alho assado, requeijão e ervas finas", 18.00, 10, "Acompanhamentos"),

                // Bebidas (10)
                new Product("Coca-Cola Original Lata 350ml", "Refrigerante Coca-Cola tradicional em lata, servida bem gelada", 6.50, 10, "Bebidas"),
                new Product("Coca-Cola Sem Açúcar Lata 350ml", "Refrigerante Coca-Cola Zero açúcar em lata, servida bem gelada", 6.50, 10, "Bebidas"),
                new Product("Guaraná Antarctica Lata 350ml", "Refrigerante Guaraná Antarctica original em lata 350ml, bem gelado", 6.00, 10, "Bebidas"),
                new Product("Guaraná Antarctica Zero Lata 350ml", "Refrigerante Guaraná Antarctica zero açúcar em lata 350ml, bem gelado", 6.00, 10, "Bebidas"),
                new Product("Suco Natural de Laranja 500ml", "Suco 100% natural espremido da fruta na hora, sem adição de açúcar ou conservantes", 11.00, 10, "Bebidas"),
                new Product("Suco Natural de Maracujá 500ml", "Suco feito com polpa fresca da fruta, refrescante, gelado e levemente adoçado", 12.00, 10, "Bebidas"),
                new Product("Suco de Uva Integral 300ml", "Suco de uva tinto integral garrafinha 300ml sem conservantes e sem açúcares adicionados", 10.50, 10, "Bebidas"),
                new Product("Chá Gelado de Limão 450ml", "Ice tea artesanal sabor limão siciliano servido com pedras de gelo e frescor irresistível", 8.50, 10, "Bebidas"),
                new Product("Água Mineral com Gás 500ml", "Garrafa de água mineral natural com gás 500ml gelada", 5.00, 10, "Bebidas"),
                new Product("Cerveja Artesanal IPA 500ml", "Cerveja artesanal estilo India Pale Ale com aroma cítrico marcante e amargor equilibrado", 19.90, 10, "Bebidas"),

                // Sobremesas (8)
                new Product("Petit Gâteau de Chocolate Belga", "Bolo quente de chocolate belga com recheio fluído cremoso, acompanhado de bola de sorvete de baunilha", 24.90, 10, "Sobremesas"),
                new Product("Brownie com Nozes e Calda Quente", "Fatia macia e densa de brownie com nozes crocantes e calda quente de chocolate fudge", 18.50, 10, "Sobremesas"),
                new Product("Pudim de Leite Condensado da Vovó", "Fatia aveludada sem furinhos com calda generosa de caramelo dourado artesanal", 14.00, 10, "Sobremesas"),
                new Product("Torta Holandesa Fatia Gourmet", "Base crocante de biscoito calipso, creme aveludado de baunilha e ganache meio amargo", 19.00, 10, "Sobremesas"),
                new Product("Milkshake de Morango Natural 400ml", "Sorvete artesanal de creme batido com geleia de morangos selecionados e chantilly", 21.00, 10, "Sobremesas"),
                new Product("Milkshake de Chocolate e Ovomaltine 400ml", "Sorvete de chocolate cremoso batido com flocos crocantes de ovomaltine e calda", 22.50, 10, "Sobremesas"),
                new Product("Churros Espanhóis com Doce de Leite (4 un)", "Churros dourados e crocantes passados no açúcar e canela, servidos com pote de doce de leite cremoso", 17.50, 10, "Sobremesas"),
                new Product("Cheesecake de Frutas Vermelhas", "Fatia com base de biscoito amanteigado, recheio sedoso de cream cheese e calda artesanal de frutas vermelhas", 23.00, 10, "Sobremesas")
            );

            productRepository.saveAll(initialProducts);
            logger.info("Sucesso! {} produtos inseridos no banco de dados.", initialProducts.size());
        } else {
            logger.info("Produtos já cadastrados na base (total: {}).", productRepository.count());
        }
    }
}
