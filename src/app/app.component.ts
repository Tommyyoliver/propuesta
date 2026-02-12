import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  
  // Estado para saber si aceptó
  accepted: boolean = false;

  // Estilos dinámicos para el botón "No"
  noBtnStyle: { [key: string]: string } = {};
  
  // Texto inicial del botón
  currentNoText: string = 'No 😢';
  
  // Índice para recorrer los mensajes
  private noTextIndex: number = 0;

  // Lista de mensajes para el bucle infinito en mobile
  private noButtonTexts: string[] = [
    '¿Estás segura?',
    'Piénsalo bien',
    'Tomate tu tiempo para responder',
    '¿De verdad?',
    '¡No me hagas esto!',
    '¡Tengo helado! 🍦',
    'Prometo lavar los platos',
    '¿Y si lo pensamos un poco más?',
    'Mira que soy buena onda',
    '¡Por favor! 🥺',
    'No seas mala...',
    '¿Es tu última palabra?',
    'Te haré reír todos los días',
    'Vamos, di que sí',
    '¿Segura, segura?',
    'No acepto un no por respuesta',
    'Me vas a romper el corazón 💔',
    'Anda, dale al otro botón',
    '¿Un cafecito y lo charlamos?',
    '¡Vuelve a intentarlo!'
  ];

  // Mensaje al aceptar
  onYesClick() {
    this.accepted = true;
  }

  // Lógica para el click en el botón "No" (Mobile vs Desktop)
  onNoClick(event: any) {
     if (window.innerWidth <= 768) {
      this.currentNoText = this.noButtonTexts[this.noTextIndex];
      this.noTextIndex++;
      if (this.noTextIndex >= this.noButtonTexts.length) {
        this.noTextIndex = 0;
      }
    } else {
      // Si es desktop y lograron clickear, lo movemos de todas formas
      this.moveNoButton(event);
    }
  }

  // Lógica para mover el botón "No"
  moveNoButton(event: any) {
    // Si es mobile, no hacemos nada (el cambio de texto lo maneja onNoClick)
    if (window.innerWidth <= 768) {
      return;
    }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    
    // Dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnWidth = rect.width;
    const btnHeight = rect.height;

    // Posición del mouse
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Centro del botón
    const btnCenterX = rect.left + btnWidth / 2;
    const btnCenterY = rect.top + btnHeight / 2;

    // Calcular vector de dirección (del mouse hacia el botón) para que huya
    let dirX = btnCenterX - mouseX;
    let dirY = btnCenterY - mouseY;
    let magnitude = Math.sqrt(dirX * dirX + dirY * dirY);

    // Si el mouse está exactamente en el centro o muy cerca, forzar una dirección aleatoria
    if (magnitude < 0.1) {
      dirX = Math.random() - 0.5;
      dirY = Math.random() - 0.5;
      magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    }
    
    // Normalizar y definir distancia de "huida" (ej. 150px)
    const moveDistance = 100; // Reducimos la distancia para que sea más fluido y no pegue saltos tan grandes
    const moveX = (dirX / magnitude) * moveDistance;
    const moveY = (dirY / magnitude) * moveDistance;

    // Calcular nueva posición tentativa
    let newLeft = rect.left + moveX;
    let newTop = rect.top + moveY;

    // Mantener dentro de la pantalla (Clamping)
    // Si se va a salir, lo forzamos a quedarse dentro con un margen
    const padding = 20;
    const maxLeft = windowWidth - btnWidth - padding;
    const maxTop = windowHeight - btnHeight - padding;

    let clampedLeft = Math.max(padding, Math.min(newLeft, maxLeft));
    let clampedTop = Math.max(padding, Math.min(newTop, maxTop));

    // Detectar si el botón se quedó atascado en un borde (no se movió aunque debería)
    // Si intentamos movernos pero el clamping nos detuvo, teletransportamos
    if (Math.abs(clampedLeft - rect.left) < 1 && Math.abs(clampedTop - rect.top) < 1) {
      // Teletransportar a una posición aleatoria segura
      clampedLeft = Math.random() * (maxLeft - padding) + padding;
      clampedTop = Math.random() * (maxTop - padding) + padding;
    }

    // Aplicar los nuevos estilos
    this.noBtnStyle = {
      'position': 'fixed', // Usamos fixed para que las coordenadas sean relativas a la ventana
      'top': `${clampedTop}px`,
      'left': `${clampedLeft}px`,
      'transition': 'all 0.1s ease-out', // Mucho más rápido para que sea imposible de atrapar
      'z-index': '100'
    };
  }


}
