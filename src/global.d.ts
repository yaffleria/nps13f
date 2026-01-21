// Type declarations for CSS modules and side-effect CSS imports

// Allow importing CSS files as side-effects (no exports)
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Allow importing SCSS/SASS files
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}
