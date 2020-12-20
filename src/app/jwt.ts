export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export function jwtOptionsFactory(options) {
  let allowedList = options.allowedDomains || [];

  function addToAllowedDomainList(domain) {
    if (!allowedList.includes(domain)) {
      allowedList.push(domain);
    }
  }

  return {
    addToAllowedDomainList,
    options: () => ({
      ...options,
      allowedDomains: allowedList,
    }),
  };
}

export const jwtOptions = jwtOptionsFactory({
  tokenGetter,
  allowedDomains: [],
});
