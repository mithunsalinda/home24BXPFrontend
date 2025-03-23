export const useImageUploader = () => {
  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const getBase64Images = async (files: any): Promise<string[]> => {
    if (!Array.isArray(files)) return [];
    return await Promise.all(
      files.map(async (file: any) => {
        if (file.originFileObj) {
          return await convertToBase64(file.originFileObj as File);
        }
        return file.url || '';
      })
    );
  };

  return { getBase64Images };
};
