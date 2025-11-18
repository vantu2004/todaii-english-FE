import { fetchVocabDecksByGroup } from "../../../../api/servers/vocabDeckApi";
import GenericVocabGroupList from "../../../../components/servers/GenericVocabGroupList";
import { useParams } from "react-router-dom";

const VocabDecksInGroup = () => {
  const { id } = useParams();
  const fetchApi = (query) =>
    fetchVocabDecksByGroup(
      id,
      query.page,
      query.size,
      query.sortBy,
      query.direction,
      query.keyword
    );

  return (
    <GenericVocabGroupList
      title="Vocabulary Decks in Group"
      fetchApi={fetchApi}
    />
  );
};

export default VocabDecksInGroup;
