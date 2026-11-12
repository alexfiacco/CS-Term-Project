export const useRouter = () => ({ push() {}, replace() {}, back() {}, prefetch() {}, refresh() {} });
export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams(location.search);
export const useParams = () => ({});
export const notFound = () => { throw new Error("notFound"); };
export const redirect = () => {};
export const permanentRedirect = () => {};
