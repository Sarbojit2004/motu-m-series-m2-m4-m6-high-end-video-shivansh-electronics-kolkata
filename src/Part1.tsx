import React from 'react';
import {Reel} from './components/Reel';
import {part1Scenes} from './scenes/part1';

/** Part 1 — "The Engine". 2640 frames / 88.000 s at 1080x1920. */
export const Part1Engine: React.FC = () => <Reel part={1} scenes={part1Scenes} />;
