import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { ImageSelector } from 'app/components/ImageSelector';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute } from 'app/routes';
import { createNews, getNewsById, updateNews } from 'app/services/news';
import { useEffect, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate, useParams } from 'react-router-dom';
import { EditMode } from 'types/edit-mode';
import { News, NewsContentFormat, NewsType } from 'types/news';
import { getImageUrl } from 'utils/get-image-url';

export const ModNewsCreateEditPage = (props: { mode: EditMode }) => {
  const { newsId } = useParams();

  const navigate = useNavigate();
  const { mode } = props;

  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showErrorSnackbar } = useGlobalSnackbar();

  const [isNewsLoading, setNewsLoading] = useState<boolean>(true);
  const [news, setNews] = useState<News | null>(null);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (newsId != null) {
      getNewsById(newsId)
        .then(res => {
          setNews(res.data.data);
        })
        .finally(() => {
          setNewsLoading(false);
        });
    } else {
      setNewsLoading(false);
    }
  }, [newsId]);

  if (isNewsLoading) {
    return <Loading />;
  }

  return (
    <FormContainer
      defaultValues={news ?? undefined}
      onSuccess={data => {
        showDialog({
          title: `${mode === EditMode.Edit ? 'Edit' : 'Create'} news`,
          description: 'Are you sure you want to continue?',
          onConfirm: async () => {
            setDialogLoading(true);

            try {
              if (mode === EditMode.Edit) {
                await updateNews(
                  newsId!,
                  {
                    title: data.title,
                    content: data.content,
                    type: NewsType.General,
                    contentFormat: NewsContentFormat.Plaintext,
                  },
                  file,
                );
              } else {
                await createNews(
                  {
                    title: data.title,
                    content: data.content,
                    type: NewsType.General,
                    contentFormat: NewsContentFormat.Plaintext,
                  },
                  file,
                );
              }
              navigate(AppRoute.ModNewsList);
            } catch (err) {
              showErrorSnackbar(err.response.data.error.details);
            }
          },
        });
      }}
    >
      <Typography variant={'h4'} sx={{ mt: 3 }}>
        {mode === EditMode.Edit ? 'Edit' : 'Create'} news
      </Typography>
      <Typography variant={'h6'} color={'text.secondary'} sx={{ my: 1 }}>
        Enter all the requirement info to{' '}
        {mode === EditMode.Edit ? 'edit' : 'create'} news
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }}>
            Basic info
          </Typography>
          <TextFieldElement
            fullWidth
            name="title"
            label="Title"
            sx={{ my: 2 }}
            required
          />
          <TextFieldElement
            fullWidth
            name="content"
            label="Content"
            multiline
            rows={12}
            sx={{ my: 2 }}
            inputProps={{ maxLength: 3000 }}
            required
          />
          {/* <Typography variant={'h6'} sx={{ mt: 4 }}>
            Publishing status
          </Typography>
          <SwitchElement name="isPublished" label="Publish now" /> */}
        </Grid>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }}>
            Thumbnail
          </Typography>
          <Box sx={{ my: 2 }}>
            <ImageSelector
              imageStyle={{ height: '400px' }}
              onFilePick={file => setFile(file)}
              defaultUrl={getImageUrl(news?.thumbnail)}
            />
          </Box>
        </Grid>
      </Grid>
      <Stack direction={'row'} justifyContent="center">
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(AppRoute.ModNewsList)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Button type="submit" variant="contained">
          {mode === EditMode.Edit ? 'Edit' : 'Create'}
        </Button>
      </Stack>
    </FormContainer>
  );
};
