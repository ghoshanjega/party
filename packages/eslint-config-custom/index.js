module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    // semi: [2, "always"],
    "max-len": ["warn", { "code": 80 }]
  },
};
