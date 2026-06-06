const Paginator = require('./_partial/paginator');
const HomeCover = require('./_partial/home-cover');
const { Component, Fragment } = require('inferno');

module.exports = class extends Component {
    render() {
        const { page, partial, theme } = this.props;
        const currentPage = page.current || 1;
        const showHomeCover = currentPage === 1 && (!theme.homeCover || theme.homeCover.enable !== false);

        return (
            <Fragment>
                {showHomeCover ? <HomeCover {...this.props} /> : ''}
                <section
                    id="nexmoe-home-main"
                    class="nexmoe-posts"
                    dangerouslySetInnerHTML={{ __html: partial('_index/list') }}
                ></section>
                {page.total > 1 ? <Paginator {...this.props} /> : ''}
            </Fragment>
        );
    }
};
