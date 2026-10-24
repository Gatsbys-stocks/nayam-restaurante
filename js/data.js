/* Datos del restaurante: carta, reseñas y horario. Edita este archivo para cambiar precios o platos.
   Las fotos van en assets/img/ con dos tamaños: NOMBRE-s.webp (miniatura) y NOMBRE-l.webp (grande). */
(function (w) {
const WA = '34673327809';
/* [foto|null, precio, [nombre ES, EN], [descripción ES, EN]] */
const I = (img,p,n,d)=>({i:img,p,n,d});
const L = (n,p,d)=>({n,p,d});
const MENU = {
food:[
 {id:'cold',t:['Entrantes fríos','Cold starters'],items:[
  I('ensalada-burrata-nayam',12.5,['Ensalada de Burrata','Burrata Salad'],['Mezclum, tomates cherry, burrata cremosa y pesto verde.','Mixed greens, cherry tomatoes, creamy burrata and green pesto.']),
  I('ensalada-cesar-nayam',13,['Ensalada César','Caesar Salad'],['Mezclum, cherry, crutones, pollo crujiente, parmesano y salsa César.','Mixed greens, cherry tomatoes, croutons, crispy chicken, parmesan and Caesar dressing.']),
  I('ensalada-de-salmon-nayam',14,['Ensalada de Salmón','Salmon Salad'],['Salmón ahumado con mango, manzana Granny Smith y aguacate, vinagreta trufada de limón.','Smoked salmon with mango, Granny Smith apple and avocado, truffled lemon vinaigrette.']),
  I('ensalada-de-gambas-nayam-real',15,['Ensalada de Gambas','Prawn Salad'],['Tartar de aguacate con mango y pepino, gambas, encurtidos y salsa del chef.','Avocado tartare with mango and cucumber, topped with prawns, pickles and chef sauce.'])]},
 {id:'hot',t:['Entrantes calientes','Hot starters'],items:[
  I('alitas-de-pollo-buffalo-nayam',11,['Alitas de Pollo Buffalo','Buffalo Chicken Wings'],['Bañadas en nuestra salsa Buffalo casera.','Coated in our homemade Buffalo sauce.']),
  I('gambas-dynamite-nayam',11,['Gambas Dynamite','Gambas Dynamite'],['Rebozadas en panko con salsa Dynamite.','Panko-breaded with Dynamite sauce.']),
  I('chicken-dynamite-nayam',11,['Chicken Dynamite','Chicken Dynamite'],['Taquitos de pollo al estilo coreano con salsa Dynamite.','Korean-style breaded chicken bites with Dynamite sauce.']),
  I('gambas-diabolo-nayam',13,['Gambas Diabolo','Gambas Diabolo'],['Salteadas en salsa Diabolo casera con un toque picante.','Sautéed in our homemade Diabolo sauce with a spicy kick.'])]},
 {id:'burgers',t:['Burgers','Burgers'],items:[
  I('hamburguesa-nayam-barcelona',14,['La Clásica','The Classic'],['Carne Angus, cebolla caramelizada, cheddar y salsa burger casera. Con patatas Tijuana.','Angus beef, caramelised onion, cheddar and homemade burger sauce. With Tijuana fries.']),
  I('burger-pollo-crujiente-real',15,['Pollo Crujiente','Crispy Chicken'],['Pollo marinado y crujiente, cheddar y salsa cremosa. Con patatas Tijuana.','Marinated crispy chicken, cheddar and creamy sauce. With Tijuana fries.']),
  I('doble-smash-nayam',16,['La Doble Smash','The Double Smash'],['Doble Angus, doble cheddar y salsa burger casera. Con patatas Tijuana.','Double Angus, double cheddar and homemade burger sauce. With Tijuana fries.'])]},
 {id:'pasta',t:['Pasta','Pasta'],items:[
  I('pasta-penne-arrabbiata-nayam',13,['Penne Arrabbiata','Penne Arrabbiata'],['Salsa de tomate con un toque picante.','Tomato sauce with a spicy kick.']),
  I('espaguetis-bolonesa-nayam',14,['Espaguetis a la Boloñesa','Spaghetti Bolognese'],['Carne de vacuno y salsa de tomate casera.','Beef and homemade tomato sauce.']),
  I('tagliatelle-alfredo-nayam',16,['Tagliatelle Alfredo','Tagliatelle Alfredo'],['Pollo, champiñones y salsa cremosa Alfredo.','Chicken, mushrooms and creamy Alfredo sauce.']),
  I('tagliatelle-al-salmon-nayam',17,['Tagliatelle al Salmón','Salmon Tagliatelle'],['Dados de salmón salteados y salsa cremosa del chef.','Sautéed salmon cubes and chef creamy sauce.']),
  I('pasta-diabolo-nayam',17,['Pasta Diabolo','Pasta Diabolo'],['Gambas salteadas en salsa cremosa con un toque de tomate.','Sautéed prawns in a creamy sauce with a touch of tomato.'])]},
 {id:'mains',t:['Platos principales','Main courses'],items:[
  I('suprema-de-pollo-nayam',17,['Suprema de Pollo Asado','Roast Chicken Supreme'],['Con puré de patatas y verduras salteadas.','Served with mashed potato and sautéed vegetables.']),
  I('salmon-tierno-nayam',19,['Salmón Tierno','Tender Salmon'],['Salsa cremosa a las tres pimientas y verduras salteadas.','Creamy three-pepper sauce and sautéed vegetables.']),
  I('entrecot-de-ternera-nayam',23,['Entrecot de Ternera','Beef Entrecôte'],['Puré de patatas, crema de calabaza y verduras salteadas.','Mashed potato, pumpkin cream and sautéed vegetables.']),
  I('solomillo-de-ternera-nayam',24,['Solomillo de Ternera','Beef Sirloin'],['Salsa de champiñones, puré de patatas y verduritas salteadas.','Mushroom sauce, mashed potato and sautéed vegetables.']),
  I('costillas-bbq-black-angus-nayam',27,['Costillas Black Angus','Black Angus Ribs'],['Salsa BBQ casera (opción picante) y patatas Tijuana.','Homemade BBQ sauce (spicy option) with Tijuana fries.'])],
  extra:{t:['Complementos','Sides'],list:[L(['Patatas Fritas','Fries'],3),L(['Arroz Basmati','Basmati Rice'],3.5),L(['Verduras Salteadas','Sautéed Vegetables'],3.5)]}},
 {id:'pizzas',t:['Pizzas','Pizzas'],items:[
  I('pizza-margarita-nayam',13,['Margarita','Margherita'],['Tomate, mozzarella y albahaca.','Tomato, mozzarella and basil.']),
  I('pizza-cuatro-quesos-nayam',14,['Cuatro Quesos','Four Cheeses'],['Mezcla de quesos fundidos.','A blend of melted cheeses.']),
  I('pizza-atun-cebolla-nayam',15,['Atún y Cebolla','Tuna & Onion'],['Atún, cebolla y aceitunas negras.','Tuna, onion and black olives.']),
  I('pizza-bolonesa-nayam',15,['Boloñesa','Bolognese'],['Carne y salsa de tomate casera.','Beef and homemade tomato sauce.']),
  I('pizza-pollo-bbq-nayam',16,['Pollo BBQ','BBQ Chicken'],['Pollo y salsa barbacoa.','Chicken and barbecue sauce.']),
  I('pizza-del-mar-nayam',16,['Del Mar','Seafood'],['Selección de mariscos.','A seafood selection.'])]},
 {id:'sweet',t:['Crepes y pancakes','Crepes & pancakes'],items:[
  I('crepes-nayam',6.5,['Crepes','Crepes'],['A elegir: Chocolate, Fresa, Lotus o Pistacho.','Choose: Chocolate, Strawberry, Lotus or Pistachio.']),
  I('pancakes-nayam',6,['Pancakes','Pancakes'],['A elegir: Chocolate, Fresa, Lotus o Pistacho.','Choose: Chocolate, Strawberry, Lotus or Pistachio.'])]},
 {id:'desserts',t:['Postres','Desserts'],items:[
  I('cheesecake-clasica',5.5,['Cheesecake Clásica','Classic Cheesecake'],['Tarta de queso cremosa al horno.','Creamy baked cheesecake.']),
  I('cheesecake-ferrero',5.5,['Cheesecake Roche','Roche Cheesecake'],['Cheesecake de chocolate y avellana estilo Ferrero.','Chocolate & hazelnut cheesecake, Ferrero style.']),
  I('cheesecake-pistacho',5.5,['Cheesecake Pistacho','Pistachio Cheesecake'],['Cheesecake cremoso de pistacho.','Creamy pistachio cheesecake.'])]},
 {id:'shakes',t:['Batidos','Milkshakes'],items:[
  I('batido-mango',5,['Batido de Mango','Mango'],['',''] ),I('batido-multifrutas',5,['Batido Multifrutas','Mixed Fruits'],['','']),
  I('batido-pina',5,['Batido de Piña','Pineapple'],['','']),I('batido-platano',5,['Batido de Plátano','Banana'],['','']),
  I('batido-fresa',5,['Batido de Fresa','Strawberry'],['','']),I('batido-frutos-bosque',5,['Batido de Frutos del Bosque','Forest Berries'],['',''])]},
 {id:'drinks',t:['Café y bebidas','Coffee & drinks'],list:[
  L(['Café Solo','Espresso'],1.8),L(['Cortado','Cortado'],2),L(['Café con Leche','White Coffee'],2.3),L(['Americano','Americano'],2.3),L(['Capuchino','Cappuccino'],2.6),
  L(['Agua','Water'],2.2),L(['Refrescos','Soft Drinks'],2.5),L(['Zumos','Juices'],2.8),L(['Hawaii','Hawaii'],3),L(['Poms','Poms'],3)]}
],
breakfast:[
 {id:'sets',t:['Desayunos completos','Breakfast sets'],items:[
  I('desayuno-clasico',5.9,['Clásico','Classic'],['2 huevos fritos, zumo, pan y una bebida caliente a elegir.','2 fried eggs, juice, bread and a hot drink of choice.']),
  I('desayuno-marroqui',12.9,['Marroquí','Moroccan'],['Harcha, batbout, msemen, mermelada, queso fresco, miel, aceitunas, zumo y bebida caliente.','Harcha, batbout, msemen, jam, fresh cheese, honey, olives, juice and a hot drink.']),
  I('desayuno-beldi',11.9,['Beldi','Beldi'],['Huevo con khlii, queso fresco, aceitunas negras, pan, zumo y bebida caliente.','Egg with khlii, fresh cheese, black olives, bread, juice and a hot drink.']),
  I('desayuno-frances',11.9,['Francés','French'],['Bollería, pan, queso, embutidos, mermelada, Nutella, zumo y bebida caliente.','Viennoiseries, bread, cheese, cold cuts, jam, Nutella, juice and a hot drink.']),
  I('desayuno-espanol',11.9,['Español','Spanish'],['Pan, tomate, queso manchego, huevo, aceite de oliva, zumo y bebida caliente.','Bread, tomato, manchego cheese, egg, olive oil, juice and a hot drink.']),
  I('desayuno-especial',28,['Especial (2 personas)','Special (2 people)'],['Bollería, harcha, msemen, batbout, queso, embutidos, mermelada, miel, Nutella, huevos, zumo y bebidas.','Viennoiseries, harcha, msemen, batbout, cheese, cold cuts, jam, honey, Nutella, eggs, juice and hot drinks.'])]},
 {id:'alacarte',t:['À la carte','À la carte'],list:[
  L(['Msemen','Msemen'],3,['Crepe marroquí','Moroccan pancake']),L(['Harcha','Harcha'],3,['Torta de sémola','Semolina cake']),L(['Bollería','Pastries'],3),
  L(['Huevo frito (1 u / 2 u)','Fried egg (1 pc / 2 pc)'],[3,5.5]),L(['Extra: mermelada, miel, chocolate o mantequilla','Extra: jam, honey, chocolate or butter'],2)]},
 {id:'tortillas',t:['Tortillas','Omelettes'],list:[
  L(['Natural','Plain'],5.9),L(['Con queso','With cheese'],7.5),L(['Con champiñones','With mushrooms'],7.9),L(['Pavo y queso','Turkey & cheese'],7.9)]},
 {id:'tostadas',t:['Tostadas','Toasts'],list:[
  L(['Salmón ahumado','Smoked salmon'],9.9),L(['Queso de cabra y miel','Goat cheese & honey'],8.9),L(['Aguacate y salmón','Avocado & salmon'],10.5),L(['Caprese','Caprese'],8.9),L(['Croque Madame','Croque Madame'],9.9)]},
 {id:'coffee',t:['Café','Coffee'],list:[
  L(['Café solo','Espresso'],1.8),L(['Cortado','Cortado'],2),L(['Café con leche','White coffee'],2.3),L(['Americano','Americano'],2.3),L(['Capuchino','Cappuccino'],2.6)]}
]};

const STRIP = [
  ['ensalada-de-salmon-nayam',['Ensalada de Salmón','Salmon Salad']],['hamburguesa-nayam-barcelona',['La Clásica','The Classic']],
  ['pasta-penne-arrabbiata-nayam',['Penne Arrabbiata','Penne Arrabbiata']],['gambas-dynamite-nayam',['Gambas Dynamite','Gambas Dynamite']],
  ['pizza-atun-cebolla-nayam',['Pizza Atún y Cebolla','Tuna & Onion Pizza']],['chicken-dynamite-nayam',['Chicken Dynamite','Chicken Dynamite']],
  ['solomillo-de-ternera-nayam',['Solomillo de Ternera','Beef Sirloin']],['plato-gourmet-nayam',['Plato gourmet','Gourmet dish']]];

const REVS = [
  ['Isamar Lucena','Lugar muy agradable, excelente servicio y comida deliciosa!'],
  ['Daniel Wobig','Fantastic food and very friendly service. Highly recommended!'],
  ['Jean Andara','Excelente servicio, ambiente y personas, volveré 100% '],
  ['Y Hh','Local muy bonito y acogedor. La comida está deliciosa y se nota que es totalmente casera. Los camareros ofrecen un servicio excelente, siempre atentos y amables. ¡Muy recomendable!']];

/* Domingo a jueves 08:00-00:00, viernes y sábado 08:00-01:00 (lunes primero) */
const HOURS = [['08:00','00:00'],['08:00','00:00'],['08:00','00:00'],['08:00','00:00'],['08:00','01:00'],['08:00','01:00'],['08:00','00:00']];

/* Vídeos del TikTok del restaurante (@nayambarcelona). id = número al final de la URL del vídeo en TikTok.
   El clip va en assets/video/ID.mp4 (vertical 9:16, H.264) y la portada en assets/img/tiktok-ID.webp. views es orientativo. */
const VIDEOS = [
 {
  "id": "7696513662965550358",
  "title": "¿De quién es el restaurante?…",
  "views": 781300
 },
 {
  "id": "7695094084620307734",
  "title": "Estos son los 3 ingredientes favoritos del morad en una pizza",
  "views": 888900
 },
 {
  "id": "7690652881128656150",
  "title": "Esto es lo que desayuna el morad…",
  "views": 699600
 },
 {
  "id": "7692433735270042902",
  "title": "El morad con su gente en nayam…",
  "views": 593900
 },
 {
  "id": "7697612677270474006",
  "title": "Esto es lo que come el Morad después de un concierto…",
  "views": 118600
 },
 {
  "id": "7679512320468389142",
  "title": "Nuevo horario: Abrimos a las 08:00 para ofreceros los mejores desayun…",
  "views": 525300
 },
 {
  "id": "7686087757613108502",
  "title": "el plato más caro de nuestra carta",
  "views": 419400
 },
 {
  "id": "7681001677809405206",
  "title": "Estos son sus platos favoritos…",
  "views": 355800
 },
 {
  "id": "7693908616977403158",
  "title": "hoy tenemos doble visita de nuestros primos",
  "views": 578300
 },
 {
  "id": "7693544577243860246",
  "title": "5 preguntas con el morad…",
  "views": 223000
 },
 {
  "id": "7684716980481395990",
  "title": "Se ha escapado de casa…",
  "views": 220200
 },
 {
  "id": "7682041349385784598",
  "title": "Respondiendo a comentarios…",
  "views": 430100
 }
];

/* Fotos de clientes publicadas en Google Maps: [archivo, [alt ES, alt EN], forma p=vertical s=cuadrada l=horizontal] */
const GPHOTOS = [
  ['google-1',['El comedor de Nayam con mesas de madera y butacas grises','Nayam dining room with wooden tables and grey armchairs'],'p'],
  ['google-2',['Hamburguesa con patatas y zumos sobre una tabla de madera','Burger with fries and juices on a wooden board'],'s'],
  ['google-3',['Café con leche y postre con chocolate','Latte and a chocolate dessert'],'p'],
  ['google-4',['Plato de verduras sobre mesa de madera','Vegetable dish on a wooden table'],'p'],
  ['google-5',['Brochetas de pollo con patatas','Chicken skewers with fries'],'p'],
  ['google-6',['Hamburguesa con patatas en tabla de madera','Burger with fries on a wooden board'],'p'],
  ['google-7',['Tagliatelle en plato blanco','Tagliatelle in a white bowl'],'l']
];

/* Cifras de la franja bajo la portada (de Google Maps y TikTok a fecha de la última revisión; actualízalas cuando cambien) */
const STATS = [
  {v:4.8,dec:1,l:['valoración en Google','rating on Google']},
  {v:99,dec:0,l:['reseñas en Google','Google reviews']},
  {v:18600,dec:0,compact:true,l:['seguidores en TikTok','TikTok followers']},
  {v:620900,dec:0,compact:true,l:['me gusta en TikTok','TikTok likes']}
];

w.NAYAM_DATA = { WA: WA, MENU: MENU, STRIP: STRIP, REVS: REVS, HOURS: HOURS, VIDEOS: VIDEOS, GPHOTOS: GPHOTOS, STATS: STATS };
})(window);
