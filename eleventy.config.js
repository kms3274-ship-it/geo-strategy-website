export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/assets":"assets"});
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addFilter("dateDisplay", date => new Date(date).toLocaleDateString("ko-KR",{timeZone:"UTC"}));1
  eleventyConfig.addFilter("dateISO", date => new Date(date).toISOString());
  eleventyConfig.addCollection("posts", api => api.getFilteredByTag("posts").sort((a,b)=>a.date-b.date));
  return {dir:{input:"src",output:"dist",includes:"_includes"},templateFormats:["njk","md","html"],markdownTemplateEngine:"njk",htmlTemplateEngine:"njk"};
}
