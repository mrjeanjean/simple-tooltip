import './style.css';
import {attachTooltip} from "./tooltip";

document.querySelectorAll('[data-tooltip]').forEach($element=>{
    const label = $element.getAttribute('title');
    $element.removeAttribute('title');
    $element.setAttribute('aria-label', label);
    attachTooltip($element, label);
})
