export const validateUsername = (username: string): string | null => {
  const trimmed = username.trim();
  if (!trimmed) return "Username không được để trống";
  if (trimmed.length < 2 || trimmed.length > 20)
    return "Username phải từ 2 đến 20 ký tự";
  // Chỉ cho phép chữ, số và khoảng trắng giữa các từ
  // if (!/^[a-zA-Z0-9 ]+$/.test(trimmed))
  //   return "Username chỉ được phép nhập chữ, số và khoảng trắng";
  return null; // hợp lệ
};

export const validatePassword = (password: string): string | null => {
  const trimmed = password.trim();
  if (!trimmed) return "Password không được để trống";
  if (trimmed.length < 4 || trimmed.length > 20)
    return "Password phải từ 4 đến 20 ký tự";
  if (!/^[a-zA-Z0-9]+$/.test(trimmed))
    return "Password chỉ được phép nhập chữ và số";
  return null; // hợp lệ
};
