const PADDING = 10;

function getOffset(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        x += el.offsetLeft - el.scrollLeft;
        y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {top: y, left: x};
}

function generateStyles($element, $tooltip) {
    const elementPosition = getOffset($element);
    const elementSize = $element.getBoundingClientRect();

    $tooltip.style.position = 'absolute';

    let tooltipSize = $tooltip.getBoundingClientRect();


    let left = elementPosition.left + (elementSize.width / 2 - tooltipSize.width / 2);

    // ENSURE STILL VISIBLE
    left = left < PADDING ? PADDING : left;
    left = left + tooltipSize.width > document.body.clientWidth ? document.body.clientWidth - tooltipSize.width : left;

    tooltipSize = $tooltip.getBoundingClientRect();
    let top = elementPosition.top - tooltipSize.height;

    // PREVENT TOP OVERFLOW
    if(elementPosition.top - (tooltipSize.height) < window.scrollY){
        top = elementPosition.top + elementSize.height;
        $tooltip.classList.add('tooltip--bottom')
    }

    $tooltip.style.top = `${top}px`;
    $tooltip.style.left = `${left}px`;

    // ARROW
    const $tooltipArrow = Object.assign(
        document.createElement("div"),
        {
            className: "tooltip__arrow",
        }
    );

    const arrowLeft = (elementPosition.left + elementSize.width / 2) - left;

    $tooltipArrow.style.left = `${arrowLeft}px`;
    $tooltip.appendChild($tooltipArrow);
}

function displayTooltip($element, label) {
    const $tooltip = Object.assign(
        document.createElement("div"),
        {
            className: "tooltip"
        }
    );

    const $toolTipContent = Object.assign(
        document.createElement("div"),
        {
            className: "tooltip__content",
            innerHTML: label,
        }
    );

    $tooltip.appendChild($toolTipContent);
    document.body.appendChild($tooltip);
    generateStyles($element, $tooltip);

    setTimeout(()=>{
        $tooltip.classList.add('tooltip-animation--enter');
    }, 20);

    return $tooltip;
}


export function attachTooltip($target, content) {
    let $tooltip = null;

    function showTooltip(e){
        const label = content ? content : $target.getAttribute('data-tooltip');
        $tooltip = displayTooltip(e.currentTarget, label);
    }

    function hideTooltip(){
        if ($tooltip) {
            $tooltip.remove();
        }
    }

    $target.addEventListener('mouseenter', showTooltip);
    $target.addEventListener('focus', showTooltip);
    $target.addEventListener('mouseleave', hideTooltip);
    $target.addEventListener('blur', hideTooltip);
}
