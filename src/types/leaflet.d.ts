import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface Control extends L.Control {
      addTo(map: L.Map): this;
      remove(): this;
      getContainer(): HTMLElement;
      onAdd(map: L.Map): HTMLElement;
      onRemove(map: L.Map): void;
      getPosition(): L.ControlPosition;
      setPosition(position: L.ControlPosition): this;
      options: any;
    }
    function control(options?: any): Control;
  }
} 