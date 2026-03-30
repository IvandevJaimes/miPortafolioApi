export const handleEmptyId = (req: any, res: any, _next: any) => {
  res.status(400).json({ success: false, error: "ID requerido" });
};
