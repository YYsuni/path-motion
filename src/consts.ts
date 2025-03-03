/**
 * view: view only;
 * normal: editable and normal view;
 * point: always show all points;
 * refine: always show all points and point controls;
 */
export type CanvasMode = 'view' | 'normal' | 'point' | 'refine'
export const canvasModes: CanvasMode[] = ['view', 'normal', 'point', 'refine']
