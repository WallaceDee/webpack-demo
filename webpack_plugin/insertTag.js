function insertTag(options) {
    this.options = options;
}

insertTag.prototype.apply = function(compiler) {
    var paths = this.options.paths;
    compiler.plugin('compilation', function(compilation, options) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            for (var i = paths.length - 1; i >= 0; i--) {
                if (paths[i].indexOf(".js") !== -1) {
                    htmlPluginData.assets.js.unshift(paths[i]);
                } else if (paths[i].indexOf(".css") !== -1) {
                    htmlPluginData.assets.css.unshift(paths[i]);
                }
            }
            callback(null, htmlPluginData);
        });
    });
};

module.exports = insertTag;