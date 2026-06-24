import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { Observable, catchError, from, map } from 'rxjs';
import {
  ContentBanner,
  ContentCategory,
  ContentProduct,
  ContentRestaurant,
  FoodContent,
  GroceryContent,
  HomeContent,
  PharmacyContent,
  ProfileContent,
} from '../models/content.models';
import { PocketbaseService } from './pocketbase.service';

type Section = 'home' | 'food' | 'grocery' | 'pharmacy';

interface ContentCollections {
  categories: RecordModel[];
  banners: RecordModel[];
  products: RecordModel[];
  promotions: RecordModel[];
  businesses: RecordModel[];
}

@Injectable({
  providedIn: 'root',
})
export class ContentDataService {
  private readonly http = inject(HttpClient);
  private readonly pb = inject(PocketbaseService).getInstance();
  private readonly baseUrl = 'assets/data';

  getHomeContent(): Observable<HomeContent> {
    return this.fromPocketBaseOrJson('home', this.getHomeJson(), (data) => {
      const offer = data.promotions[0];

      return {
        categories: data.categories.map((category, index) => this.toCategory(category, index)),
        offerStrip: {
          text: offer?.['description'] || offer?.['title'] || 'Promos del día y ofertas cerca de ti',
          image: this.resolveImage(offer, 'image') || 'assets/images/landing/discount-tag.png',
          alt: offer?.['badgeText'] || 'promoción',
        },
        banners: data.banners.map((banner) => this.toBanner(banner)),
        featuredProducts: data.products.map((product) => this.toProduct(product)),
      };
    });
  }

  getFoodContent(): Observable<FoodContent> {
    return this.fromPocketBaseOrJson('food', this.getFoodJson(), (data) => ({
      banners: data.banners.map((banner, index) => ({
        ...this.toBanner(banner),
        variant: index === 1 ? 'home-banner2' : undefined,
      })),
      categories: data.categories.map((category, index) => this.toCategory(category, index)),
      popularProducts: data.products.map((product) => this.toProduct(product)),
      restaurants: data.businesses.map((business, index) => this.toRestaurant(business, index)),
      brands: data.businesses.map((business) => ({
        title: business['name'],
        image: this.resolveImage(business, 'logo') || this.resolveImage(business, 'cover') || 'assets/images/icons/brand1.png',
        alt: business['name'],
        link: '#',
      })),
      offers: data.promotions.map((promotion) => this.toBanner(promotion)),
      emptyState: {
        title: 'Antojos resueltos con Dale Pues',
        subtitle: 'Comida preparada y entregas urbanas cerca de ti',
      },
    }));
  }

  getGroceryContent(): Observable<GroceryContent> {
    return this.fromPocketBaseOrJson('grocery', this.getGroceryJson(), (data) => {
      const mainBanners = data.banners.filter((banner) => Number(banner['position'] || 0) <= 1);
      const offerBanners = data.banners.filter((banner) => Number(banner['position'] || 0) > 1);
      const products = data.products.map((product) => this.toProduct(product));

      return {
        categories: data.categories.map((category, index) => this.toCategory(category, index)),
        banners: mainBanners.map((banner) => this.toBanner(banner)),
        products: products.filter((product) => this.hasProductSection(product, 'products')).slice(0, 3),
        popularProducts: products.filter((product) => this.hasProductSection(product, 'popular')).slice(0, 3),
        offers: offerBanners.map((banner) => this.toBanner(banner)),
        bestSellers: products.filter((product) => product.active || product.offerTag).slice(0, 2),
        recentItems: products
          .filter((product) => this.hasProductSection(product, 'recent'))
          .map((product) => ({
            ...product,
            deliveryTime: product.deliveryTime?.startsWith('A ') ? product.deliveryTime : 'A 20 min de tu casa',
          })),
      };
    });
  }

  getPharmacyContent(): Observable<PharmacyContent> {
    return this.fromPocketBaseOrJson('pharmacy', this.getPharmacyJson(), (data) => {
      const mainBanners = data.banners.filter((banner) => Number(banner['position'] || 0) <= 1);
      const discountBanners = data.banners.filter((banner) => Number(banner['position'] || 0) > 1);
      const products = data.products.map((product) => this.toProduct(product));

      return {
        categories: data.categories.map((category, index) => this.toCategory(category, index)),
        banners: mainBanners.map((banner) => this.toBanner(banner)),
        offers: products.filter((product) => this.hasProductSection(product, 'offers')).slice(0, 2),
        products: products.filter((product) => this.hasProductSection(product, 'products')).slice(0, 2),
        wellnessItems: products.filter((product) => this.hasProductSection(product, 'wellness')),
        discountBanners: discountBanners.map((banner) => this.toBanner(banner)),
        bestSellers: products.filter((product) => this.hasProductSection(product, 'bestSellers')),
      };
    });
  }

  getProfileContent(): Observable<ProfileContent> {
    return this.getProfileJson();
  }

  resolveImage(record: RecordModel | undefined, fieldName: string): string {
    if (!record) {
      return '';
    }

    const fileValue = record[fieldName];
    const urlValue = record[`${fieldName}Url`];

    if (typeof urlValue === 'string' && urlValue.length > 0) {
      return urlValue;
    }

    if (Array.isArray(fileValue) && fileValue.length > 0) {
      return this.pb.files.getURL(record, fileValue[0]);
    }

    if (typeof fileValue === 'string' && fileValue.length > 0) {
      if (fileValue.startsWith('assets/') || fileValue.startsWith('http')) {
        return fileValue;
      }

      return this.pb.files.getURL(record, fileValue);
    }

    return '';
  }

  private fromPocketBaseOrJson<T>(
    section: Section,
    fallback$: Observable<T>,
    mapper: (data: ContentCollections) => T,
  ): Observable<T> {
    return this.getPocketBaseCollections(section).pipe(
      map((data) => {
        if (this.isEmptyContent(data)) {
          throw new Error(`PocketBase content for ${section} is empty.`);
        }

        return mapper(data);
      }),
      catchError(() => fallback$),
    );
  }

  private getPocketBaseCollections(section: Section): Observable<ContentCollections> {
    return from(
      Promise.all([
        this.pb.collection('categories').getFullList({
          filter: section === 'home' ? 'active = true && type = "home"' : `active = true && type = "${section}"`,
          sort: 'order,name',
        }),
        this.pb.collection('banners').getFullList({
          filter: `active = true && section = "${section}"`,
          sort: 'position,created',
        }),
        this.pb.collection('products').getFullList({
          filter:
            section === 'home'
              ? 'active = true && featured = true'
              : `active = true && type = "${section}"`,
          sort: '-featured,created',
        }),
        this.pb.collection('promotions').getFullList({
          filter: `active = true && section = "${section}"`,
          sort: 'order,created',
        }),
        this.pb.collection('businesses').getFullList({
          filter: this.getBusinessFilter(section),
          sort: '-featured,name',
        }),
      ]),
    ).pipe(
      map(([categories, banners, products, promotions, businesses]) => ({
        categories,
        banners,
        products,
        promotions,
        businesses,
      })),
    );
  }

  private getBusinessFilter(section: Section): string {
    if (section === 'food') {
      return 'active = true && type = "restaurant"';
    }

    if (section === 'grocery' || section === 'pharmacy') {
      return `active = true && type = "${section}"`;
    }

    return 'active = true';
  }

  private isEmptyContent(data: ContentCollections): boolean {
    return (
      data.categories.length === 0 &&
      data.banners.length === 0 &&
      data.products.length === 0 &&
      data.promotions.length === 0 &&
      data.businesses.length === 0
    );
  }

  private toCategory(record: RecordModel, index: number): ContentCategory {
    return {
      title: record['name'],
      image: this.resolveImage(record, 'image') || record['icon'] || '',
      alt: record['alt'] || record['name'],
      link: record['link'] || '#',
      active: index === 0 || record['active'] === true,
    };
  }

  private toBanner(record: RecordModel): ContentBanner {
    return {
      title: record['title'],
      subtitle: record['subtitle'],
      highlight: record['highlight'],
      image: this.resolveImage(record, 'image'),
      alt: record['alt'] || record['title'],
      ctaText: record['ctaText'] || 'Pedir ahora',
      link: record['link'] || '#',
    };
  }

  private toProduct(record: RecordModel): ContentProduct {
    const tags = this.getTags(record);

    return {
      title: record['name'],
      description: record['description'],
      image: this.resolveImage(record, 'image'),
      alt: record['alt'] || record['name'],
      price: Number(record['price'] || 0),
      oldPrice: record['oldPrice'] ? Number(record['oldPrice']) : undefined,
      currency: record['currency'] || '$',
      unit: tags['unit'],
      rating: Number(record['rating'] || 0),
      deliveryTime: record['deliveryTime'],
      offerTag: tags['offerTag'],
      ctaText: record['ctaText'] || 'Agregar',
      link: '#',
      active: record['featured'] === true,
      sections: tags['section'],
    };
  }

  private toRestaurant(record: RecordModel, index: number): ContentRestaurant {
    const defaults = [
      { place: 'Chacao', price: 5, distance: '2 km', reviews: '1k+ reseñas', offerAmount: 'hasta $2', offerLabel: 'Promo' },
      { place: 'Las Mercedes', price: 19, distance: '3 km', reviews: '10k+ reseñas', offerAmount: 'hasta $10', offerLabel: 'Oferta', badge: 'Más vendido' },
      { place: 'Sabana Grande', price: 3, distance: '2.5 km', reviews: '20k+ reseñas', badge: 'Más vendido' },
      { place: 'Altamira', price: 6, distance: '2.6 km', reviews: '300k+ reseñas' },
      { place: 'La Candelaria', price: 5, distance: '1 km', reviews: '50k+ reseñas', offerAmount: 'hasta $20', offerLabel: '50% menos', badge: 'Más vendido' },
    ][index] || { place: record['address'] || 'Paraguaná', price: 5, distance: '2 km', reviews: '1k+ reseñas' };

    return {
      title: record['name'],
      image: this.resolveImage(record, 'cover') || this.resolveImage(record, 'logo'),
      alt: record['name'],
      link: '#',
      items: record['description'] || 'Comida local...',
      rating: Number(record['rating'] || 0),
      reviews: defaults.reviews,
      place: record['address'] || defaults.place,
      pricePerPerson: defaults.price,
      currency: '$',
      distance: defaults.distance,
      deliveryTime: record['deliveryTime'] || '20 min',
      offerAmount: defaults.offerAmount,
      offerLabel: defaults.offerLabel,
      badge: defaults.badge,
    };
  }

  private hasProductSection(product: ContentProduct, section: string): boolean {
    return product.sections?.split(',').map((value) => value.trim()).includes(section) || false;
  }

  private getTags(record: RecordModel): Record<string, string> {
    const tags = record['tags'];
    return tags && typeof tags === 'object' && !Array.isArray(tags) ? tags : {};
  }

  private getHomeJson() {
    return this.http.get<HomeContent>(`${this.baseUrl}/home.json`);
  }

  private getFoodJson() {
    return this.http.get<FoodContent>(`${this.baseUrl}/food.json`);
  }

  private getGroceryJson() {
    return this.http.get<GroceryContent>(`${this.baseUrl}/grocery.json`);
  }

  private getPharmacyJson() {
    return this.http.get<PharmacyContent>(`${this.baseUrl}/pharmacy.json`);
  }

  private getProfileJson() {
    return this.http.get<ProfileContent>(`${this.baseUrl}/profile.json`);
  }
}
