import React from 'react';
import {Reel} from './components/Reel';
import {part2Scenes} from './scenes/part2';

/** Part 2 — "The Scale-Up". 2640 frames / 88.000 s at 1080x1920. */
export const Part2ScaleUp: React.FC = () => <Reel part={2} scenes={part2Scenes} />;
