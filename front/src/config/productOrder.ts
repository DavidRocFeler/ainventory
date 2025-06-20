// Lista tus 50 productos en el orden exacto que quieres
export const PRODUCT_ORDER = [
  'Pepsi max',
  'Pepsi', 
  'Ice tea',
  'Ice tea green',
  'Birra moretti 0.0',
  'Amstel Rose 4.0',
  'Brand Weizen 0.0',
  'Aqua Panna',
  'San Pellegrino',
  'Bitter lemon',
  'Aqua tonic',
  'Appelsap',
  'Ginger Beer',
  'Ginger Ale',
  '7up',
  'Sisi',
  'Rivella',
  'Cassis',
  'Chocomelk',
  'Fristi',
  'Spritz',
  'Milk',
  'Affligem Tripel',
  'Affligem blond',
  'Heineken 0.0',
  'Amstel 2.0',
  'Amstel 0.0',
  'Ichnusa non filtrata',
  'Ichnusa anima sarda',
  'Aqua panna 0.75ml',
  'Sanpellegrino 0.75ml',
  'Pinot grigio',
  'Rose',
  'Proseco',
  'RocketShoot',
  'Ketel 1',
  'Monica Rosso',
  'Arenada',
  'Bardolino',
  'Negroamaro',
  'Merles',
  'Grotta Rosso',
  'Chianty',
  'Limoncello',
  'Vermentino',
  'Frizzantino',
  'Chardonay',
  'Lambrusco',
  'Jameson',
  'Jack daniels',
  'Bacardi',
  'Gin',
  '50',
  'Expresso',
  'Amaretto',
  'Liquor 45',
];

// Convertir a mapa para búsqueda más eficiente
export const getProductOrderMap = () => {
const orderMap = new Map<string, number>();
PRODUCT_ORDER.forEach((productName, index) => {
orderMap.set(productName, index);
});
return orderMap;
};