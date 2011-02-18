require({
    baseUrl: "../third-party",
    paths: {
        require: "requirejs/require"
    },
    packages: [
        { name: "has", lib: "detect", main: "has" },
        { name: "uber", location: "..", main: "uber" }
    ]
});
