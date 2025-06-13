module.exports = function resourceLoader(resources = []) {
    return (config) => {
        const regexArr = [/\.module\.(scss|sass)$/, /\.(scss|sass)$/].map((r) => r.toString());

        for (let rule of config?.module?.rules || []) {
            if (!rule.oneOf) continue;

            for (let current of rule.oneOf) {
                let { test, use } = current;
                if (!test) continue;

                if (regexArr.includes(test.toString())) {
                    use.push({
                        loader: 'sass-resources-loader',
                        options: { resources },
                    });
                }
            }
        }
    };
};
