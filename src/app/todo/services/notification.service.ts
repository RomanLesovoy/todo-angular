import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private updateSound = new Audio('/sounds/update-sound.mp3');
  private tapSound = new Audio('/sounds/tap-sound.mp3');
  private errorSound = new Audio('/sounds/error-sound.mp3');
  private debug: boolean = isDevMode();

  private playUpdateSound() {
    this.updateSound.play();
  }

  private playErrorSound() {
    this.errorSound.play();
  }

  private playTapSound() {
    this.tapSound.play();
  }

  public pushErrorNotification(e: Error) {
    this.playErrorSound();
    this.debug && console.error(e.message);
  }

  public pushUpdateNotification(action: 'create' | 'delete' | 'update', value: any = null) {
    action === 'delete' ? this.playTapSound() : this.playUpdateSound();
    this.debug && value && console.info(value);
  }
}
