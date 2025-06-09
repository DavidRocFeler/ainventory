import { AppDataSource } from "../config/dataSource";
import { ProductEntity } from "../entities/ProductEntity";
import { ProductRepository } from "../repositories/product.repository";

export interface IProduct {
  name: string;
  currentStock: number;
  incoming: number;
  consumed: number;
  total: number;
  unit: string;
  icon: string;
  category: 'wine' | 'beer' | 'liqueur' | 'soda' | 'water' | 'drinks-o' | 'drinks' | 'others';
}

const productsToPreLoad: IProduct[] = [
  {
    name: 'Pepsi max',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/MAX.png',
    category: 'soda'
  },
  {
    name: 'Pepsi', 
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Pepsi.png',
    category: 'soda'
  },
  {
    name: 'Ice tea',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IceTea.png',
    category: 'drinks-o'
  },
  {
    name: 'Ice tea green',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IceTeaGreen.png',
    category: 'drinks-o'
  },
  {
    name: 'Birra moretti 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/BirraMoreti.png',
    category: 'beer'
  },
  {
    name: 'Amstel Rose 4.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/AmstelRose.png',
    category: 'beer'
  },
  {
    name: 'Brand Weizen 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/BrandWeizen.png',
    category: 'beer'
  },
  {
    name: 'Aqua Panna',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/AquaPanna.png',
    category: 'water'
  },
  {
    name: 'San Pellegrino',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'SanPellegrino.png',
    category: 'water'
  },
  {
    name: 'Bitter lemon',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'BitterLemon.png',
    category: 'drinks-o'
  },
  {
    name: 'Aqua tonic',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/TonicRoyalClub.png',
    category: 'water'
  },
  {
    name: 'Appelsap',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'AppelSap.png',
    category: 'drinks-o'
  },
  {
    name: 'Ginger Beer',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'GingerBeer.png',
    category: 'soda'
  },
  {
    name: 'Ginger Ale',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/GingerAle.png',
    category: 'soda'
  },
  {
    name: '7up',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/7up.png',
    category: 'soda'
  },
  {
    name: 'Sisi',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Sisi.png',
    category: 'soda'
  },
  {
    name: 'Rivella',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Rivella.png',
    category: 'drinks-o'
  },
  {
    name: 'Cassis',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Cassis.png',
    category: 'soda'
  },
  {
    name: 'Chocomelk',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Chocomelk.png',
    category: 'drinks-o'
  },
  {
    name: 'Fristi',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Fristi.png',
    category: 'drinks-o'
  },
  {
    name: 'Spritz',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Spritz.png',
    category: 'drinks'
  },
  {
    name: 'Milk',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Milk.png',
    category: 'others'
  },
  {
    name: 'Affligem Tripel',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Tripel.png',
    category: 'beer'
  },
  {
    name: 'Affligem blond',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Blond.png',
    category: 'beer'
  },
  {
    name: 'Heineken 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Heniken.png',
    category: 'beer'
  },
  {
    name: 'Amstel 2.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Amstel20.png',
    category: 'beer'
  },
  {
    name: 'Amstel 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Amstel0.png',
    category: 'beer'
  },
  {
    name: 'Ichnusa non filtrata',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IchnnusaNonFiltrata.png',
    category: 'beer'
  },
  {
    name: 'Ichnusa anima sarda',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IchnnusaAnimaSarda.png',
    category: 'beer'
  },
  {
    name: 'Aqua panna 0.75ml',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/AquaPanna075.png',
    category: 'water'
  },
  {
    name: 'Sanpellegrino 0.75ml',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/SanPellegrino075.png',
    category: 'water'
  },
  {
    name: 'Pinot grigio',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/WhiteWine.png',
    category: 'wine'
  },
  {
    name: 'Rose',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Rose.png',
    category: 'wine'
  },
  {
    name: 'Proseco',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Proseco.png',
    category: 'wine'
  },
  {
    name: 'RocketShoot',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RocketShoot.png',
    category: 'drinks'
  },
  {
    name: 'Ketel 1',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Ketel1.png',
    category: 'liqueur'
  },
  {
    name: 'Monica Rosso',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Arenada',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Bardolino',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Negroamaro',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Merles',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Grotta Rosso',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Chianty',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Chianti.png',
    category: 'wine'
  },
  {
    name: 'Limoncello',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Limoncello.png',
    category: 'liqueur'
  },
  {
    name: 'Vermentino',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/WhiteWine.png',
    category: 'wine'
  },
  {
    name: 'Frizzantino',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/WhiteWine.png',
    category: 'wine'
  },
  {
    name: 'Chardonay',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/WhiteWine.png',
    category: 'wine'
  },
  {
    name: 'Lambrusco',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RedWine.png',
    category: 'wine'
  },
  {
    name: 'Jameson',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/jameson.png',
    category: 'liqueur'
  },
  {
    name: 'Jack daniels',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/JackDaniels.png',
    category: 'liqueur'
  },
  {
    name: 'Bacardi',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/bacardi.png',
    category: 'liqueur'
  },
  {
    name: 'Gin',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Gin.png',
    category: 'liqueur'
  },
  {
    name: 'Expresso',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: 'ExpressoMartini.png',
    category: 'drinks'
  },
  {
    name: 'Amaretto',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Amaretto.png',
    category: 'liqueur'
  },
  {
    name: 'Liquor 45',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Liquor45.png',
    category: 'liqueur'
  },
];


export const preLoadProducts = async () => {
  const products = await ProductRepository.find();
  if (!products.length)
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(ProductEntity)
      .values(productsToPreLoad)
      .execute();
  console.log("Products preloaded");
};
