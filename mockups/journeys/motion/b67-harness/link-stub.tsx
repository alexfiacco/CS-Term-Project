import React from "react";
const Link = React.forwardRef<HTMLAnchorElement, any>(({ href, prefetch, scroll, replace, ...p }, ref) => <a ref={ref} href={typeof href === "string" ? href : "#"} {...p} onClick={(e) => { e.preventDefault(); p.onClick?.(e); }} />);
export default Link;
