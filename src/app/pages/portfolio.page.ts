import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

type PortfolioCategory = 'slub' | 'chrzest';

type PortfolioItem = {
  title: string;
  image: string;
  alt: string;
};

@Component({
  selector: 'app-portfolio-page',
  imports: [NgOptimizedImage],
  templateUrl: './portfolio.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'handleLightboxKeydown($event)',
  },
})
export class PortfolioPage {
  protected readonly activeCategory = signal<PortfolioCategory>('slub');
  protected readonly selectedPhoto = signal<PortfolioItem | null>(null);
  protected readonly gallerySection = viewChild<ElementRef<HTMLElement>>('gallerySection');

  private readonly imageFiles = [
    'IMG_5744.JPG',
    'IMG_5745.JPG',
    'IMG_5746.JPG',
    'IMG_5747.JPG',
    'IMG_5748.JPG',
    'IMG_5749.JPG',
    'IMG_5750.JPG',
    'IMG_5751.JPG',
    'IMG_5752.JPG',
    'IMG_5753.JPG',
    'IMG_8437.JPG',
    'me.jpg',
    'Moda 7.01.20233527jpg.jpg',
    'Moda 7.01.20233538sociale.jpg',
    'Moda 7.01.20233632 jpg.jpg',
    'profilowe.jpg',
    'student 12.040878.jpg',
    'student 12.040890.jpg',
    'ula.jpg',
    'Zaoczne 20213003.jpg',
    '_MG_2117.jpg',
  ] as const;

  private readonly allItems: readonly PortfolioItem[] = this.imageFiles.map((file) => {
    const title = this.toTitle(file);

    return {
      title,
      image: `/images/${encodeURIComponent(file)}`,
      alt: `Zdjecie portfolio ${title}`,
    };
  });

  private readonly explicitChrzest = this.allItems.filter((item) =>
    item.image.toLowerCase().includes('chrzest'),
  );

  private readonly nonChrzest = this.allItems.filter(
    (item) => !item.image.toLowerCase().includes('chrzest'),
  );

  private readonly splitIndex = Math.ceil(this.nonChrzest.length / 2);

  protected readonly portfolio = {
    slub:
      this.explicitChrzest.length > 0 ? this.nonChrzest : this.nonChrzest.slice(0, this.splitIndex),
    chrzest:
      this.explicitChrzest.length > 0
        ? this.explicitChrzest
        : this.nonChrzest.slice(this.splitIndex),
  } satisfies Record<PortfolioCategory, readonly PortfolioItem[]>;

  protected readonly displayedPhotos = computed(() => this.portfolio[this.activeCategory()]);

  protected selectCategory(category: PortfolioCategory): void {
    this.activeCategory.set(category);

    requestAnimationFrame(() => {
      this.gallerySection()?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  protected openLightbox(photo: PortfolioItem): void {
    this.selectedPhoto.set(photo);
  }

  protected closeLightbox(): void {
    this.selectedPhoto.set(null);
  }

  protected showPreviousPhoto(): void {
    const photos = this.displayedPhotos();
    const currentIndex = this.findSelectedIndex(photos);

    if (currentIndex < 0 || photos.length === 0) {
      return;
    }

    const previousIndex = (currentIndex - 1 + photos.length) % photos.length;
    this.selectedPhoto.set(photos[previousIndex]);
  }

  protected showNextPhoto(): void {
    const photos = this.displayedPhotos();
    const currentIndex = this.findSelectedIndex(photos);

    if (currentIndex < 0 || photos.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % photos.length;
    this.selectedPhoto.set(photos[nextIndex]);
  }

  protected handleLightboxKeydown(event: KeyboardEvent): void {
    if (!this.selectedPhoto()) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeLightbox();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPreviousPhoto();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNextPhoto();
    }
  }

  private findSelectedIndex(photos: readonly PortfolioItem[]): number {
    const selected = this.selectedPhoto();

    if (!selected) {
      return -1;
    }

    return photos.findIndex((item) => item.image === selected.image);
  }

  private toTitle(fileName: string): string {
    return fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
