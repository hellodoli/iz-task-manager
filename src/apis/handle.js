export const handleSuccess = (response) => {
  const data = response.data;
  if (data) {
    return new Promise((resolve, reject) => {
      if (data.isError || data.error)
        return reject(data);
      return resolve(data);
    });
  }
};