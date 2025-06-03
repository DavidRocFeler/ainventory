import { AppDataSource } from "../config/dataSource";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";

export interface IProduct {
  name: string;
  currentStock: number;
  incoming: number;
  consumed: number;
  total: number;
  unit: string;
  icon: string;
  category: 'wine' | 'beer' | 'spirits' | 'coffee' | 'other';
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
    category: 'wine'
  },
  {
    name: 'Pepsi', 
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Pepsi.png',
    category: 'beer'
  },
  {
    name: 'Ice tea',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IceTea.png',
    category: 'spirits'
  },
  {
    name: 'Ice tea green',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IceTeaGreen.png',
    category: 'wine'
  },
  {
    name: 'Birra moretti 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'kg',
    icon: '/BirraMoreti.png',
    category: 'coffee'
  },
  {
    name: 'Amstel Rose 4.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/AmstelRose.png',
    category: 'spirits'
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
    category: 'spirits'
  },
  {
    name: 'San Pellegrino',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'SanPellegrino.png',
    category: 'wine'
  },
  {
    name: 'Bitter lemon',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'BitterLemon.png',
    category: 'spirits'
  },
  {
    name: 'Aqua tonic',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/TonicRoyalClub.png',
    category: 'wine'
  },
  {
    name: 'Appelsap',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'AppelSap.png',
    category: 'beer'
  },
  {
    name: 'Ginger Beer',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: 'GingerBeer.png',
    category: 'spirits'
  },
  {
    name: 'Ginger Ale',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/GingerAle.png',
    category: 'spirits'
  },
  {
    name: '7up',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'kg',
    icon: '/7up.png',
    category: 'coffee'
  },
  {
    name: 'Sisi',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Sisi.png',
    category: 'wine'
  },
  {
    name: 'Rivella',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Rivella.png',
    category: 'wine'
  },
  {
    name: 'Cassis',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Cassis.png',
    category: 'wine'
  },
  {
    name: 'Chocomelk',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Chocomelk.png',
    category: 'wine'
  },
  {
    name: 'Fristi',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Fristi.png',
    category: 'wine'
  },
  {
    name: 'Spritz',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Spritz.png',
    category: 'wine'
  },
  {
    name: 'Milk',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Milk.png',
    category: 'wine'
  },
  {
    name: 'Affligem Tripel',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Tripel.png',
    category: 'spirits'
  },
  {
    name: 'Affligem blond',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'kg',
    icon: '/Blond.png',
    category: 'coffee'
  },
  {
    name: 'Heineken 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Heniken.png',
    category: 'wine'
  },
  {
    name: 'Amstel 2.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Amstel20.png',
    category: 'wine'
  },
  {
    name: 'Amstel 0.0',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/Amstel0.png',
    category: 'wine'
  },
  {
    name: 'Ichnusa non filtrata',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IchnnusaNonFiltrata.png',
    category: 'wine'
  },
  {
    name: 'Ichnusa anima sarda',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/IchnnusaAnimaSarda.png',
    category: 'wine'
  },
  {
    name: 'Aqua panna 0.75ml',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/AquaPanna075.png',
    category: 'wine'
  },
  {
    name: 'Sanpellegrino 0.75ml',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,
    unit: 'bottles',
    icon: '/SanPellegrino075.png',
    category: 'wine'
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
    category: 'spirits'
  },
  {
    name: 'Proseco',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'kg',
    icon: '/Proseco.png',
    category: 'coffee'
  },
  {
    name: 'RocketShoot',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/RocketShoot.png',
    category: 'wine'
  },
  {
    name: 'Ketel 1',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Ketel1.png',
    category: 'wine'
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
    category: 'wine'
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
    category: 'wine'
  },
  {
    name: 'Jack daniels',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/JackDaniels.png',
    category: 'wine'
  },
  {
    name: 'Bacardi',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/bacardi.png',
    category: 'wine'
  },
  {
    name: 'Gin',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Gin.png',
    category: 'wine'
  },
  {
    name: 'Expresso',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: 'ExpressoMartini.png',
    category: 'wine'
  },
  {
    name: 'Amaretto',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Amaretto.png',
    category: 'wine'
  },
  {
    name: 'Liquor 45',
    currentStock: 0,
    incoming: 0,
    consumed: 0,
    total: 0,    unit: 'bottles',
    icon: '/Liquor45.png',
    category: 'wine'
  },
];


export const preLoadProducts = async () => {
  const products = await ProductRepository.find();
  if (!products.length)
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values(productsToPreLoad)
      .execute();
  console.log("Products preloaded");
};
