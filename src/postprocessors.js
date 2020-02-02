import cap from './cap';
import sortBy from './sortBy';

export default function(reductio){
    reductio.postprocessors = {};
    reductio.registerPostProcessor = function(name, func){
        reductio.postprocessors[name] = func;
    };

    reductio.registerPostProcessor('cap', cap);
    reductio.registerPostProcessor('sortBy', sortBy);
}
