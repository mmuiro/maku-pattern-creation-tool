import React, { useCallback, useState, useRef } from 'react';
import { Box, Divider, Flex, useBreakpointValue } from '@chakra-ui/react';
import Canvas from '../Canvas';
import EditorMenu from '../components/EditorMenu';
import { DEFAULTS, PatternArgs } from '../maku-classes/Pattern';

export interface BooleanMap {
    [key: string]: Boolean;
}

const EditorPage: React.FC<any> = () => {
    const [patternParamsList, setPatternParamsList] = useState<PatternArgs[]>([
        { ...DEFAULTS },
    ]);
    const editorParamsList = useRef<PatternArgs[]>([{ ...DEFAULTS }]);
    const editorCheckedParamsList = useRef<BooleanMap[]>([
        { 'Rotation Reversing': false },
    ]);

    const getDefaultPreFreezeParams = () => {
        let pre: PatternArgs = { ...DEFAULTS };
        for (let prop in pre) {
            if (typeof pre[prop] === 'number' && !isFinite(pre[prop] as number))
                pre[prop] = 0;
        }
        return pre;
    };

    const editorPreFreezeParamsList = useRef<PatternArgs[]>([
        getDefaultPreFreezeParams(),
    ]);

    const applyChanges = () => {
        setPatternParamsList([...editorParamsList.current]);
    };

    const addPattern = useCallback(() => {
        editorParamsList.current.push({ ...DEFAULTS });
        editorCheckedParamsList.current.push({ 'Rotation Reversing': false });
        editorPreFreezeParamsList.current.push(getDefaultPreFreezeParams());
        applyChanges();
    }, [patternParamsList, applyChanges]);

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
                position="relative"
            >
                <EditorMenu
                    addPatternFn={addPattern}
                    updatePatterns={applyChanges}
                    patternParamsList={editorParamsList}
                    patternCheckedParamsList={editorCheckedParamsList}
                    patternPreFreezeParamsList={editorPreFreezeParamsList}
                />
            </Box>
        </Flex>
    );
};

export default EditorPage;
