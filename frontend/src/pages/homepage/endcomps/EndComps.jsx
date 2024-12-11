import './EndComps.css';
import Weather from '../weather/Weather';

export default function EndComps({onWeatherLoaded}){
    return (
        <div className='bottomWrapper'>
            <Weather onWeatherLoaded = {onWeatherLoaded} />
        </div>
    );
}