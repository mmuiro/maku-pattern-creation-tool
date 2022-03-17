import React, { useCallback, useState } from 'react';
import { Box, Divider, Flex, useBreakpointValue } from '@chakra-ui/react';
import Canvas from '../Canvas';
import EditorMenu from '../components/EditorMenu';
import { Pattern } from '../maku-classes/Pattern';
import PatternEditor from '../components/PatternEditor';

const EditorPage: React.FC<any> = () => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);

    const designatedPatternSetter = useCallback(
        (index: number) => {
            return (pattern: Pattern) => {
                patterns[index] = pattern;
                setPatterns(() => patterns);
            };
        },
        [patterns]
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
                <Canvas width={canvasAR * baseSize} height={baseSize}></Canvas>
            </Box>
            <Box
                flexGrow={1}
                flexBasis={0}
                my={4}
                mx={2}
                overflowY="scroll"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#EDF2F7',
                        borderRadius: '4px',
                    },
                }}
            >
                <EditorMenu>
                    <PatternEditor patternSetter={() => {}} />
                </EditorMenu>
            </Box>
        </Flex>
    );
};

export default EditorPage;
