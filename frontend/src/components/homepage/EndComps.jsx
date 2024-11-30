import '../../styles/endComps.css';
import Weather from '../Weather';

export default function EndComps({onWeatherLoaded}){
    return (
        <div className='bottomWrapper'>
            <Weather onWeatherLoaded = {onWeatherLoaded} />
        </div>
    );
}