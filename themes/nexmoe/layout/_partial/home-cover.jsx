const { Component } = require('inferno');

function resolveLink(url_for, link) {
    if (!link) {
        return null;
    }

    if (
        link.startsWith('#')
        || link.startsWith('http://')
        || link.startsWith('https://')
        || link.startsWith('//')
        || link.startsWith('mailto:')
    ) {
        return link;
    }

    return url_for(link);
}

module.exports = class extends Component {
    render() {
        const { config, theme, url_for } = this.props;
        const homeCover = theme.homeCover || {};
        const image = homeCover.image || theme.background.path;
        const title = homeCover.title || config.title;
        const subtitle = homeCover.subtitle || config.subtitle;
        const description = homeCover.description || config.description;
        const label = homeCover.label || (
            config.author && config.author !== title ? config.author : ''
        );
        const primaryText = homeCover.buttonText || 'Read Posts';
        const primaryLink = resolveLink(url_for, homeCover.buttonLink || '#nexmoe-home-main');
        const secondaryText = homeCover.secondaryText || '';
        const secondaryLink = resolveLink(url_for, homeCover.secondaryLink || '');

        return (
            <section class="nexmoe-home-cover">
                <div class="nexmoe-home-cover__frame">
                    <img
                        class="nexmoe-home-cover__image"
                        src={image}
                        alt={title}
                        loading="eager"
                    />
                    <div class="nexmoe-home-cover__shade"></div>
                    <div class="nexmoe-home-cover__content">
                        {label ? <p class="nexmoe-home-cover__label">{label}</p> : ''}
                        <h1 class="nexmoe-home-cover__title">{title}</h1>
                        {subtitle ? <h2 class="nexmoe-home-cover__subtitle">{subtitle}</h2> : ''}
                        {description ? (
                            <p class="nexmoe-home-cover__description">{description}</p>
                        ) : ''}
                        <div class="nexmoe-home-cover__actions">
                            {primaryLink ? (
                                <a
                                    href={primaryLink}
                                    class={`nexmoe-home-cover__button nexmoe-home-cover__button--primary ${
                                        primaryLink.startsWith('#') ? 'toc-link' : ''
                                    }`}
                                >
                                    {primaryText}
                                </a>
                            ) : ''}
                            {secondaryText && secondaryLink ? (
                                <a
                                    href={secondaryLink}
                                    class="nexmoe-home-cover__button nexmoe-home-cover__button--secondary"
                                >
                                    {secondaryText}
                                </a>
                            ) : ''}
                        </div>
                    </div>
                    <a
                        href="#nexmoe-home-main"
                        class="nexmoe-home-cover__scroll toc-link"
                        aria-label="Scroll to posts"
                    >
                        <span class="nexmoe-home-cover__scroll-text">Explore</span>
                        <span class="nexmoe-home-cover__scroll-arrow"></span>
                    </a>
                </div>
            </section>
        );
    }
};
