import React, { useCallback, useState } from 'react';
import { Box, Divider, Flex, useBreakpointValue } from '@chakra-ui/react';
import Canvas from '../Canvas';
import EditorMenu from '../components/EditorMenu';
import { DEFAULTS, PatternArgs } from '../maku-classes/Pattern';
import PatternEditor from '../components/PatternEditor';

const EditorPage: React.FC<any> = () => {
    const [patternParamsList, setPatternParamsList] = useState<PatternArgs[]>([
        { ...DEFAULTS },
    ]);

    const designatedPatternSetter: Function = useCallback(
        (index: number) =>
            useCallback(
                (patternParams: PatternArgs) => {
                    patternParamsList[index] = patternParams;
                    setPatternParamsList((test) => [...test]);
                },
                [patternParamsList]
            ),
        [patternParamsList]
    );

    const canvasAR: number = useBreakpointValue({
        base: 1,
        xl: ((window.innerWidth / window.innerHeight) * 2) / 3,
    })!;

    const baseSize = 1600;
    return (
        <Flex h="100vh" direction={{ base: 'column', xl: 'row' }}>
            <Box
                margin={4}
                boxShadow="xl"
                borderColor="blue.300"
                maxH={{ base: window.innerWidth, xl: 'full' }}
                maxW="fit-content"
                borderRadius="lg"
                overflow="hidden"
            >
                <Canvas
                    width={canvasAR * baseSize}
                    height={baseSize}
                    patterns={patternParamsList}
                ></Canvas>
            </Box>
            <Box
                flexGrow={1}
                flexBasis={0}
                my={4}
                mx={1}
                overflowY="scroll"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#EDF2F7',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#E2E8F0',
                    },
                }}
            >
                <EditorMenu>
                    <PatternEditor patternSetter={designatedPatternSetter(0)} />
                </EditorMenu>
            </Box>
        </Flex>
    );
};

export default EditorPage;
