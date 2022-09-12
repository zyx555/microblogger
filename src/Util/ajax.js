const ajax = (method, url, data) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.send(data);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (
            (xhr.status >= 200 && xhr.status < 300) ||
            xhr.status == 304
          ) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject("失败");
          }
        }
      };
    });
  };
  export default ajax