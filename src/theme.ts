import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      "html, body": {
        bg: props.colorMode === "dark" ? "#191919" : "white", // Explicit background for light and dark modes
        color: props.colorMode === "dark" ? "white" : "black", // Explicit text color
        transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out", // Smooth transitions for both
      },
    }),
  },
});

export default theme;
