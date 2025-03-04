/**
 * view: view only;
 * normal: editable and normal view;
 * point: always show all points;
 * refine: always show all points and point controls;
 */
export type CanvasMode = 'normal' | 'point' | 'refine'
export const canvasModes: CanvasMode[] = ['normal', 'point', 'refine']

export type MouseMode = 'create' | 'select'
export const mouseModes: MouseMode[] = ['create', 'select']
