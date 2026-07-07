import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  protected readonly loadingProgress = signal(0);
  protected readonly isLoading = signal(true);
  protected readonly isLoaderClosing = signal(false);

  private animationFrameId: number | null = null;
  private closeDelayId: number | null = null;

  ngOnInit(): void {
    this.setBodyLoadingState(true);

    const durationMs = 3800;
    const startTime = performance.now();

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const normalized = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - normalized, 3);
      const nextProgress = Math.min(100, eased * 100);

      this.loadingProgress.set(nextProgress);

      if (normalized < 1) {
        this.animationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      this.loadingProgress.set(100);
      this.isLoaderClosing.set(true);

      this.closeDelayId = window.setTimeout(() => {
        this.isLoading.set(false);
        this.setBodyLoadingState(false);
        this.clearCloseDelay();
      }, 520);
    };

    this.animationFrameId = window.requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.clearLoaderAnimation();
    this.clearCloseDelay();
    this.setBodyLoadingState(false);
  }

  private setBodyLoadingState(isLoading: boolean): void {
    document.body.classList.toggle('no-scroll', isLoading);
  }

  private clearLoaderAnimation(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private clearCloseDelay(): void {
    if (this.closeDelayId !== null) {
      window.clearTimeout(this.closeDelayId);
      this.closeDelayId = null;
    }
  }
}
