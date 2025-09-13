import { DragEvent } from "react";

export const preventDefault = (handler: (event: DragEvent<HTMLDivElement>) => void) => {
  return (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handler(event);
  }
}
