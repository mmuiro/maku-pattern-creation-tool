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

    const [editorMode, setEditorMode] = useState(true);

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

    const toggleEditor = () => {
        setEditorMode(!editorMode);
    };

    const canvasAR: number = useBreakpointValue({
        base: 1,
        lg: ((window.innerWidth / window.innerHeight) * 2) / 3,
    })!;

    const baseSize = 1600;
    console.log(canvasAR);
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
                    editorMode={editorMode}
                    editorParamsList={editorParamsList.current}
                    applyEditorChanges={applyChanges}
                ></Canvas>
            </Box>
            <Box
                flexGrow={1}
                flexBasis={0}
                my={4}
                mx={1}
                position="relative"
                maxH="full"
            >
                <EditorMenu
                    addPatternFn={addPattern}
                    updatePatterns={applyChanges}
                    patternParamsList={editorParamsList}
                    patternCheckedParamsList={editorCheckedParamsList}
                    patternPreFreezeParamsList={editorPreFreezeParamsList}
                    editorMode={editorMode}
                    toggleEditor={toggleEditor}
                />
            </Box>
        </Flex>
    );
};

export default EditorPage;
